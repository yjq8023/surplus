'use client'

import React, { useState } from'react'
import { Input, Button, Row, Col, Table } from 'antd'

const Main = () => {
  const [text, setText] = useState('')
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

  const columns = [

  ]
  return (
    <Row>
      <Col span={12}>
        <Input.TextArea rows={12} onChange={onChange} />
        <Button onClick={fetchAnalyzeText} type={'primary'}>解析文本</Button>
      </Col>
      <Col span={12}>
        <div>
          {
            orderData.map((item: any) => {
              return (
                <div>
                  <span>名称：{item.name}</span>
                  <span>内容：{item.data}</span>
                  <span>倍数：{item.count}</span>
                  <span>总金额：{item.sum}</span>
                  <span>下单人：{item.user}</span>
                  <span>下单时间：{item.time}</span>
                </div>
              )
            })
          }
        </div>
      </Col>
    </Row>
  )
}

export default Main
