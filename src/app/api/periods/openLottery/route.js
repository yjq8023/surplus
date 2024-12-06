import { betTypeConfig } from '@/config';
import { PrismaClient } from '@prisma/client'
import { isNull } from '@/utils/index';

const prisma = new PrismaClient()
export const POST = async (request) => {
  const requestBody = await request.json()

  const transaction = await prisma.$transaction(async (prisma) => {
    const lotteryNumber = requestBody.lotteryNumber
    const res = await prisma.periods.update({
      where: {
        id: requestBody.id
      },
      data: {
        lotteryNumber: lotteryNumber,
        disabled: true
      }
    })

    const orders = await prisma.orders.findMany({
      where: {
        periodId: res.id
      }
    })
    const tickets = await prisma.tickets.findMany({
      where: {
        orderId: {
          in: orders.map(order => order.id) // 查询匹配多个orderId
        }
      }
    })
    const mapToNumber = (arr) => {
      return arr.map((i) => {
        if (!isNull(i)) {
          return Number(i)
        }
        return i
      })
    }
    const lotteryNumberArr = lotteryNumber.split('')
    await Promise.all(tickets.map((ticketItem) => {
      const { type, data } = ticketItem;

      const bettingNumbers = JSON.parse(data)

      const prizeNumbers = []

      // 遍历所有下注的号码
      bettingNumbers.forEach((bettingNumber) => {
        // 判断是否中奖
        const isPrize = betTypeConfig[type].compute(mapToNumber(lotteryNumberArr), mapToNumber(bettingNumber))
        if (isPrize) {
          prizeNumbers.push(bettingNumber)
        }
      })

      let allPrizeAmount = 0
      prizeNumbers.forEach((prizeNumber) => {
        // 某些玩法的赔率是根据投注号码的长度决定的
        const odds = typeof betTypeConfig[type].odds === 'number' ? betTypeConfig[type].odds : betTypeConfig[type].odds[prizeNumber.length]
        const amount = ticketItem.times * betTypeConfig[type].unitPrice * odds // 中奖金额 = 单价 * 倍数 * 赔率
        allPrizeAmount = allPrizeAmount + amount
      })
      return prisma.tickets.update({
        where: {
          id: ticketItem.id
        },
        data: {
          isPrize: prizeNumbers.length > 0,
          prizeNumber: JSON.stringify(prizeNumbers),
          prizeAmount: allPrizeAmount
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
