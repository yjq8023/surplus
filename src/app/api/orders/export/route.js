import { isNull } from '@/utils'
import { PrismaClient, Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { build } from 'node-xlsx'
import { betTypeConfig } from '@/config'
import lodash from 'lodash'

const prisma = new PrismaClient()

const exportConfig = [
  {
    title: '客户名称',
    key: 'client.name',
  },
  {
    title: '周期',
    key: 'period.name',
  },
  {
    title: '打单时间',
    key: 'createTime',
    getData(record) {
      return dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
    }
  }
]
const exportConfig1 = [
  {
    title: '投注类型',
    key: 'type',
    getData(record) {
      return betTypeConfig[record.type].name
    }
  },
  {
    title: '投注号码',
    key: 'data',
    getData(record) {
      return JSON.parse(record.data).map((item) => {
        return item.join('')
      }).join('、')
    }
  },
  {
    title: '投注倍数',
    key: 'times',
  },
  {
    title: '投注金额',
    key: 'total',
  },
  {
    title: '是否中奖',
    key: 'isPrize',
    getData(record) {
      return record.isPrize ? '是' : '否'
    }
  },
  {
    title: '中奖号码',
    key: 'prizeNumber',
    getData(record) {
      return record.prizeNumber ? JSON.parse(record.prizeNumber).map((item) => {
        return item.join('')
      }).join('、') : ''
    }
  },
  {
    title: '中奖金额',
    key: 'prizeAmount',
  }
]

export const GET = async (request) => {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const { periodId, clientId, isPrize } = params
  const res = await prisma.orders.findMany({
    where: {
      periodId,
      clientId,
      tickets: {
        some: {
          isPrize: isNull(isPrize) ? undefined : isPrize === '1' // 根据isPrize字段筛选
        }
      }
    },
    include: {
      tickets: true, // 查询关联的所有票据信息
      period: true,  // 查询关联的周期信息
      client: true   // 查询关联的客户信息
    },
    orderBy: {
      createTime: 'desc' // 按date字段降序排序
    }
  });

  const data = res.map((orderItem) => {
    return {
      ...orderItem,
      tickets: isNull(isPrize) ? orderItem.tickets : orderItem.tickets.filter(item => item.isPrize === (isPrize === '1'))
    }
  })

  const excelFileData = []

  data.forEach((order) => {
    const orderItem = exportConfig.map(({ key, getData }) => {
      return getData ? getData(order) : lodash.get(order, key)
    })
    order.tickets.forEach((ticket) => {
      const item = exportConfig1.map(({ key, getData }) => {
        return getData ? getData(ticket) : ticket[key]
      })
      excelFileData.push([...orderItem, ...item])
    })
  })

  console.log(excelFileData);


  const excelFile = [
    {
      name: 'sheet1',
      data: [
        [...exportConfig, ...exportConfig1].map((item) => {
          return {
            v: item.title,
            s: {
              fill: {
                fgColor: { rgb: 'C0504D' }
              }
            }
          }
        }),
        ...excelFileData
      ],
      options: {
        '!cols': [...exportConfig, ...exportConfig1].map(() => {
          return {
            wch: 20
          }
        })
      }
    }
  ]

  const buffer = build(excelFile)


  const response = new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="export.xlsx"',
    },
  });
  return response;
  // return Response.json({})
}