import { PrismaClient, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient()
export const POST = async (request) => {
  const requestBody = await request.json()
  const { periodId, clientId, tickets } = requestBody;

  const transaction = await prisma.$transaction(async (prisma) => {
    const res = await prisma.orders.create({
      data: {
        periodId,
        clientId
      }
    });
    await Promise.all(tickets.map((ticketItem) => {
      return prisma.tickets.create({
        data: {
          orderId: res.id,
          type: ticketItem.type,
          times: ticketItem.times,
          data: JSON.stringify(ticketItem.data)
        }
      });
    }));
    return res;
  });
  return Response.json({
    code: 0,
    body: transaction
  })
}
export const GET = async (request) => {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const { periodId, clientId } = params
  const page = parseInt(params.page) || 1; // 当前页码
  const pageSize = parseInt(params.pageSize) || 20; // 每页条数
  const res = await prisma.orders.findMany({
    where: {
      periodId,
      clientId
    },
    include: {
      tickets: true, // 查询关联的所有票据信息
      period: true,  // 查询关联的周期信息
      client: true   // 查询关联的客户信息
    },
    orderBy: {
      createTime: 'desc' // 按date字段降序排序
    },
    skip: (page - 1) * pageSize, // 跳过的条数
    take: pageSize // 获取的条数
  });

  const count = await prisma.orders.count({
    where: {
      periodId,
      clientId
    }
  })

  return Response.json({
    code: 0,
    body: {
      total: count, // 总条数
      data: res.map((item) => {
        return {
          ...item,
        }
      })
    }
  });
}

