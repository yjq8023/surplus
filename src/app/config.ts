import { log } from "console"
import { isNull } from "./utils";
import lodash from 'lodash';

export const betTypes = [
  {
    name: '直选（单、或直）',
    type: 'zx',
    description: '百、十、个、都要对应的号码、例：开356/买356为中、536、365不中',
    unitPrice: 2,
    odds: 900,
    validator(value: any) {
      if (isArray(value, 3)) {
        return Promise.resolve()
      }
      return Promise.reject('请输入3位数字')
    },
    compute(drawingNumbers: number[], bettingNumber: number[]) {
      return JSON.stringify(drawingNumbers) === JSON.stringify(bettingNumber);
    }
  },
  {
    name: '组选（组三）',
    type: 'zxzs',
    description: '有两个号码重复的、例：开122/买122、221、212、为中（开豹子不中）',
    unitPrice: 2,
    odds: 300,
    validator(value: any) {
      if (isArray(value, 3) && lodash.uniq(value).length === 2) {
        return Promise.resolve()
      }
      return Promise.reject('请输入3位数字，且其中两位数字相同')
    },
    compute(drawingNumbers: number[], bettingNumber: number[]) {
      if (isExact(drawingNumbers)) {
        return false
      }
      const sortedDrawingNumbers = drawingNumbers.slice().sort();
      const sortedBettingNumber = bettingNumber.slice().sort();
      return JSON.stringify(sortedDrawingNumbers) === JSON.stringify(sortedBettingNumber);
    }
  },
  {
    name: '组选（组六）',
    type: 'zxzl',
    description: '三个号一样但不用定位、例：开423/买342、432、234等、为中（开豹子不中）',
    unitPrice: 2,
    odds: 150,
    validator(value: any) {
      if (isArray(value, 3)) {
        return Promise.resolve()
      }
      return Promise.reject('请输入3位数字')
    },
    compute(drawingNumbers: number[], bettingNumber: number[]) {
      if (isExact(drawingNumbers)) {
        return false
      }
      const sortedDrawingNumbers = drawingNumbers.slice().sort();
      const sortedBettingNumber = bettingNumber.slice().sort();
      return JSON.stringify(sortedDrawingNumbers) === JSON.stringify(sortedBettingNumber);
    }
  },
  {
    name: '独胆',
    type: 'dd',
    description: '单买一个号三个位有就算中奖、例：开345/买独胆3、或4和5为中奖',
    unitPrice: 10,
    odds: 3.3,
    validator(value: any) {
      if (isArray(value, 1)) {
        return Promise.resolve()
      }
      return Promise.reject('请输入1位数字')
    },
    compute(drawingNumbers: number[], bettingNumber: number[]) {
      const nub = bettingNumber[0]
      return drawingNumbers.includes(nub)
    }
  },
  {
    name: '一码定位',
    type: 'ymdw',
    description: '三个号码分别为：百位、十位、个位（例：开245/买百位2号为中奖',
    unitPrice: 10,
    odds: 9,
    validator(value: any) {
      if (isArray(value, 1)) {
        return Promise.resolve()
      }
      return Promise.reject('请输入1位数字')
    },
    compute(drawingNumbers: number[], bettingNumber: number[]) {
      console.log('drawingNumbers');
      console.log(drawingNumbers);
      console.log(bettingNumber);
      const num = bettingNumber.filter((i) => !isNull(i))[0]
      const index = bettingNumber.indexOf(num)
      const drawingIndex = drawingNumbers.indexOf(num)
      return drawingIndex > -1 && drawingIndex === index
    }
  },
  {
    name: '二码定位',
    type: 'emdw',
    description: '（例：开245/买（百位2、十位4）（十位4、个位5）（百位2、个位5）为中奖',
    unitPrice: 10,
    odds: 9,
    validator(value: any) {
      if (isArray(value, 2)) {
        return Promise.resolve()
      }
      return Promise.reject('请输入2位数字')
    },
    compute(drawingNumbers: number[], bettingNumber: number[]) {
      const nums = bettingNumber.filter((i) => !isNull(i))

      let isLottery = true
      bettingNumber.forEach((num, index) => {
        if (isNull(num)) return
        const drawingIndex = drawingNumbers.indexOf(num)
        if (drawingIndex === -1 || drawingIndex !== index) {
          isLottery = false
        }
      })

      return isLottery
    }
  },
  {
    name: '组六',
    type: 'zl',
    description: '例：开685/买组六6码345689、或4码4568为组六中、组三不中（开豹子不中）',
    unitPrice: 10,
    odds: {
      10: 1.2, // 全包赔率1.2
      9: 1.7, // 9码赔率 1.7
      8: 2.6,
      7: 4.2,
      6: 7.5,
      5: 15,
      4: 37
    },
    validator(value: any) {
      if (isArray(value) && value.length >= 4 && value.length <= 10) {
        return Promise.resolve()
      }
      return Promise.reject('请选择4-10位数字')
    },
    compute(drawingNumbers: number[], bettingNumber: number[]) {
      if (isExact(drawingNumbers)) {
        return false
      }
      const isLottery = drawingNumbers.filter((num) => {
        bettingNumber.includes(num)
      }).length === 3
      return isLottery;
    }
  },
  {
    name: '组三',
    type: 'zs',
    description: '（例：开188/买组三2码18、或5码13458组三中\组六不中（开豹子不中）',
    unitPrice: 10,
    odds: {
      10: 3.3, // 全包赔率 3.3
      9: 4.1, // 9码赔率 4.1
      8: 5.3,
      7: 7.1,
      6: 10,
      5: 15,
      4: 25,
      3: 50,
      2: 150,
    },
    validator(value: any) {
      if (isArray(value) && value.length >= 2 && value.length <= 10) {
        return Promise.resolve()
      }
      return Promise.reject('请选择2-10位数字')
    },
    compute(drawingNumbers: number[], bettingNumber: number[]) {
      if (isExact(drawingNumbers)) {
        return false
      }
      const isLottery = drawingNumbers.filter((num) => {
        bettingNumber.includes(num)
      }).length === 3
      return isLottery;
    }
  },
]

// 是否为豹子
const isExact = (numbers: number[]) => {
  return numbers[0] === numbers[1] && numbers[0] === numbers[2]
}

const isArray = (val: any, length?: number) => {
  return Array.isArray(val) && (length ? val.filter((i: any) => !isNull(i)).length === length : true)
}

const betTypeConfig: any = {}
betTypes.forEach((item) => {
  betTypeConfig[item.type] = item
})

export { betTypeConfig }


