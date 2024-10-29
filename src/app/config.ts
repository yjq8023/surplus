export const betTypes = [
  {
    name: '直选（单、或直）',
    type: 'zx',
    description: '猜3个数字',
    unitPrice: 2
  },
  {
    name: '组选（组三）',
    type: 'zxzs',
    description: '猜3个数字，其中2个数字是重复的',
    unitPrice: 2
  },
  {
    name: '组三（多码）',
    type: 'zs',
    description: '猜2-9个数字',
    unitPrice: 10,
    children: [
      {
        name: '组三-二码',
        description: '猜3个数字',
      },
      {
        name: '组三-三码',
        description: '猜3个数字',
      },
      {
        name: '组三-四码',
        description: '猜4个数字',
      },
      {
        name: '组三-五码',
        description: '猜5个数字',
      },
      {
        name: '组三-六码',
        description: '猜6个数字',
      },
      {
        name: '组三-七码',
        description: '猜7个数字',
      },
      {
        name: '组三-八码',
        description: '猜8个数字',
      },
      {
        name: '组三-九码',
        description: '猜9个数字',
      },
    ]
  },
  {
    name: '组选（组六）',
    type: 'zl',
    description: '猜3-9个数字',
    unitPrice: 10,
    children: [
      {
        name: '组六-三码',
        description: '猜3个数字',
      },
      {
        name: '组六-四码',
        description: '猜4个数字',
      },
      {
        name: '组六-五码',
        description: '猜5个数字',
      },
      {
        name: '组六-六码',
        description: '猜6个数字',
      },
      {
        name: '组六-七码',
        description: '猜7个数字',
      },
      {
        name: '组六-八码',
        description: '猜8个数字',
      },
      {
        name: '组六-九码',
        description: '猜9个数字',
      },
    ]
  },
  {
    name: '独胆',
    type: 'dd',
    description: '单猜1个数字',
    unitPrice: 10
  },
  {
    name: '一码定位',
    type: 'ymdw',
    description: '猜1个数字和它在开奖结果中的位置，如：1**   1。。   1.. 等描述都是代码猜开奖结果中第一位为1，你转成的数据为: [1, null, null]',
    unitPrice: 10
  },
  {
    name: '二码定位',
    type: 'emdw',
    description: '猜2个数字和它们分别在开奖结果中的位置, ，如：1*2   1。2   1.2 等描述都是代码猜开奖结果中第一位为1，第三为为2，你转成的数据为: [1, null, 2]',
    unitPrice: 10,
  }
]
