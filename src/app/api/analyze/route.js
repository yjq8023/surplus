import {betTypes} from "@/app/config";

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: "sk-KlJcx7pj4V0GYNUJA68Epnn59q9efU9KQaXzaNopvbJ8Zbwx",
  baseURL: "https://api.moonshot.cn/v1",
});


const types = [
  {
    name: '直选',
    description: '猜三位数字，数字和顺序与开奖结果完全一致则中',
    unitPrice: 2
  },
  {
    name: '组三',
    description: '猜2-9位数字，全包含开奖结果且没有重复数字则中，顺序不论。',
    unitPrice: 2
  },
  {
    name: '组六',
    description: '猜3-9位数字，全包含开奖结果则中，顺序不论',
    unitPrice: 2
  },
  {
    name: '独胆',
    description: '猜一位数字，开奖结果中包含该数字则中',
    unitPrice: 10
  },
  {
    name: '一码定位',
    description: '猜一位数字以及它对应的个十百位，数字与开奖结果中的个/十/百位中数字一致则中',
    unitPrice: 10
  },
  {
    name: '二码定位',
    description: '猜两位数字以及它们对应的个十百位，数字与开奖结果中的个/十/百位中数字一致则中',
    unitPrice: 10
  },
]

const typeStr = types.map((item, index) => {
  return `规则${index + 1}. 规则名称：${item.name}，规则描述：${item.description}， 单价：${item.price}`
}).join('。')
const demoOrders = [
  {
    userName: '小红',
    userMessage: '我想竞猜一码定位，竞猜的数字是3，竞猜的倍数是2',
    time: '2024-12-12 12:00:00',
    orders: [
      {
        name: '一码定位',
        data: [[null,3,null], [null,null,6]],
        times: 2
      },
      {
        name: '组',
        data: [[null,3,null], [null,null,6]],
        times: 2
      },
    ]
  }
]
const prefix = '你是一个竞猜游戏的下单客服，客户会通过描述跟你下单，一条消息为一单，消息中会包含竞猜的规则名称，竞猜的值和下单的总金额，你需要根据客户的口语描述并结合游戏规则，按下述要求转换成json数据。' +
  '游戏规则：从000到999的数字中随机一个三位数作为结果，根据结果可以拆分成个十百三位数字，客户可以对这三位数字按下述竞猜规则进行竞猜。' +
  `竞猜规则：这是一份json数据，其中包含每个竞猜规则的名称，描述和单价和客户下单描述示例。${JSON.stringify(types)}。` +
  // `竞猜规则：${typeStr}。` +
  `你需要输出的JSON格式案例：` + JSON.stringify(demoOrders) +
  '回答前请认真思考，确保数据的准确性。你可以通过用户下单的总金额，对比你输出的数据检查是否一致。比如总金额是否等于单价乘以倍数'


const betTypesConfig = betTypes.map((item, index) => {
  return {
    name: item.name,
    description: item.description,
  }
})
const prefix2 = [
  '你是一个服务于彩票工作的人工智能助手，你非常熟悉彩票的玩法和规则，你擅长把客户下单描述转换成彩票订单系统需要的json数据。',
  '游戏规则：随机3个数字组成开奖结果，如: [1,5,6], [2,5,9]等。用户是不知道结果的，可以对开奖结果的值或下标进行竞猜。',
  `竞猜规则：这是一份json数据，其中包含每个竞猜规则的名称，描述。${JSON.stringify(betTypesConfig)}`,
  '你的工作流程：',
  '1、确定用户是以那个规则进行竞猜的',
  '2、根据规则的描述，确定用户竞猜的数字',
  '3、根据用户的描述，确定用户竞猜的倍数',
  '4、返回json数据，格式如下：' + JSON.stringify(demoOrders),
]


export const POST =  async (request) => {
  const requestBody = await request.json()
  const { text } = requestBody
  const completion = await client.chat.completions.create({
    model: "moonshot-v1-32k",
    messages: [
      {role: "system", content: prefix2.join('\n')},
      {role: "user", content: text},
      {role: "assistant", content: "[", partial: true}
    ],
    temperature: 0.01
  });
  const resBody = "["+completion.choices[0].message.content
  return Response.json({
    code: 0,
    body: resBody
  })
}
