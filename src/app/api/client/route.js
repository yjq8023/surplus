import { PrismaClient, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient()
export const POST = async (request) => {
  const requestBody = await request.json()
  const data = {
    name: requestBody.name,
    wechat: requestBody.wechat,
    remark: requestBody.remark,
  }
  let res;
  if (requestBody.id) {
    res = await prisma.clients.update({
      where: {
        id: requestBody.id
      },
      data: data
    })
  } else {
    res = await prisma.clients.create({
      data: data
    })
  }
  return Response.json({
    code: 0,
    body: res
  })
}
export const GET = async (request) => {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const { name, wechat } = params
  const page = parseInt(params.page) || 1; // 当前页码
  const pageSize = parseInt(params.pageSize) || 20; // 每页条数
  const res = await prisma.clients.findMany({
    where: {
      name,
      wechat
    },
    orderBy: {
      createTime: 'desc' // 按date字段降序排序
    },
    skip: (page - 1) * pageSize, // 跳过的条数
    take: pageSize // 获取的条数
  });

  const count = await prisma.clients.count({
    where: {
      name,
      wechat
    }
  })

  return Response.json({
    code: 0,
    body: {
      total: count, // 总条数
      data: res.map((item) => {
        return {
          ...item,
          date: dayjs(item.date).format('YYYY-MM-DD'),
          clientCount: 0,
          orderCount: 0,
          amount: 0
        }
      })
    }
  });
}

export const DELETE = async (request) => {
  const { id } = await request.json(); // 从请求中获取id
  if (!id) {
    return Response.json({ code: 1, message: '缺少id' });
  }
  await prisma.clients.delete({
    where: { id: id }, // 根据id删除周期
  });
  return Response.json({ code: 0, message: '删除成功' });
}
