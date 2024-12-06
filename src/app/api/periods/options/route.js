import { PrismaClient, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient()
export const GET = async (request) => {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const where = {}
  if (params.disabled) {
    where.disabled = Boolean(params.disabled)
  }
  const res = await prisma.periods.findMany({
    where,
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
