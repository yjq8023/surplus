import { isNull } from '@/utils';
import { PrismaClient, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient()
export const GET = async (request) => {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const res = await prisma.periods.findMany({
    where: {
      disabled: isNull(params.disabled) ? undefined : params.disabled === '1'
    },
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
