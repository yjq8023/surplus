import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()
export const GET = async (request) => {

  const res = await prisma.clients.findMany({
    where: {},
  });

  return Response.json({
    code: 0,
    body: res
  });
}
