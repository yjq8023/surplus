import { PrismaClient, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient()
export const GET = async (request) => {

  const res = await prisma.clients.findMany({
    where: {},
  });

  return Response.json({
    code: 0,
    body: res.map((item) => {
      return {
        ...item,
        date: dayjs(item.date).format('YYYY-MM-DD'),
      }
    })
  });
}
