'use client'

import React, { useState } from'react'
import { Input, Button, Row, Col, Table } from 'antd'

const Main = () => {
  const [text, setText] = useState('' +
    '🤡Jun 2024/10/08 22:19\n' +
    '体:01245678组六1060\n' +
    '\n' +
    '🤡Jun 2024/10/08 22:19\n' +
    '排列三选号\n' +
    '百位：0,1,2,3,4\n' +
    '十位：5,7\n' +
    '个位：0,1,2,5.\n' +
    '\n' +
    '一倍直总100\n' +
    '\n' +
    '🤡Jun 2024/10/08 22:19\n' +
    '体彩直选：  000  666 777 555  5倍40元\n' +
    '\n' +
    '🤡Jun 2024/10/08 22:19\n' +
    '体包组三360米共计360\n' +
    '\n' +
    '🤡Jun 2024/10/08 22:19\n' +
    '569 体 组选总10\n' +
    '\n' +
    '🤡Jun 2024/10/08 22:19\n' +
    '体彩\n' +
    '0235689复试   100\n' +
    '\n' +
    '🤡Jun 2024/10/08 22:19\n' +
    ' 排列三\n' +
    '34567（组6）\n' +
    '35倍\n' +
    '35687（组6）\n' +
    '35倍\n' +
    '435678（组6）\n' +
    '20倍合计\n' +
    '\n' +
    '🤡Jun 2024/10/08 22:19\n' +
    '体胆2打500\n' +
    '\n' +
    '🤡Jun 2024/10/08 22:19\n' +
    '体彩：34。36。飞各50总100\n' +
    '\n')
  const [orderData, setOrderData] = useState<any>([])
  const fetchAnalyzeText = async () => {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        contentType: 'application/json'
      },
      body: JSON.stringify({
        text
      })
    })
    const data = await res.json()
    console.log(data.body);
    setOrderData(data.body)
  }

  const onChange = (e: any) => {
    setText(e.target.value)
  }

  return (
    <Row>
      <Col span={12}>
        <Input.TextArea rows={12} value={text} onChange={onChange} />
        <Button onClick={fetchAnalyzeText} type={'primary'}>解析文本</Button>
      </Col>
      <Col span={12}>
        <div>
          {orderData}
        </div>
      </Col>
    </Row>
  )
}

export default Main
