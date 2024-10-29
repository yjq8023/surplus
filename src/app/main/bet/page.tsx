'use client'

import React, { useState } from 'react'
import { Form, Button, Space, Input, InputNumber } from 'antd'
import DirectBet from "@/app/components/BetTypes/DirectBet";
import styles from './index.module.css'
import {betTypes} from "@/app/config";
import GroupBet from "@/app/components/BetTypes/GroupBet";

const FormItem = Form.Item



const typeOptions = betTypes.map(item => {
  return {
    label: item.name,
    value: item.type,
    unitPrice: item.unitPrice,
  }
})

const Bet = () => {
  const [form] = Form.useForm()

  const handleSubmit = (formValue: any) => {
    console.log('formValue');
    console.log(formValue);
  }

  const handleAddTypeItem = (defaultValue: any) => {
    const oldOrders = form.getFieldValue('orders') || []
    form.setFieldValue('orders', [...oldOrders, defaultValue])
  }



  return (
    <div className={styles.bet}>
      <div className={styles.betHeader}>
        <h4>类型</h4>
        <Space>
          {
            betTypes.map((item) => {
              return (
                <Button key={item.type} onClick={() => handleAddTypeItem({
                  name: item.name,
                  type: item.type,
                  unitPrice: item.unitPrice,
                })}>
                  {item.name}
                </Button>
              )
            })
          }
        </Space>
        {/*<Checkbox.Group value={checkedType} options={typeOptions} onChange={handleTypeChange} />*/}
      </div>
      <Form form={form} onFinish={handleSubmit}>
        <Form.List
          name={'orders'}
        >
          {(fields, { add, remove }) => {
            return <Space direction={'vertical'} style={{ width: '100%'}}>
              {fields.map((props) => {
                return (<BetTypeCard {...props} remove={remove} />)
              })}
            </Space>
          }}
        </Form.List>
        <div className={styles.formFooter}>
          <Space>
            <Button type={'default'} htmlType={'reset'}>重置</Button>
            <Button type={'primary'} htmlType={'submit'}>提交</Button>
          </Space>
        </div>
      </Form>
    </div>
  )
}

const renderTypeForm = (type: string, props: any) => {
  if(type === 'zx') {
    return <DirectBet {...props}/>
  }
  if(type === 'zxzs') {
    return <DirectBet {...props}/>
  }
  if(type === 'zxzl') {
    return <DirectBet {...props}/>
  }
  if(type === 'zs') {
    return <GroupBet min={2} {...props}/>
  }
  if(type === 'zl') {
    return <GroupBet min={3} {...props}/>
  }
  if(type === 'ymdw') {
    return <DirectBet count={1} {...props}/>
  }
  if(type === 'emdw') {
    return <DirectBet count={2} {...props}/>
  }
  return 'todo'
}
const BetTypeCard = (props: any) => {
  const { key, name, ...restField } = props;
  const form = Form.useFormInstance()
  const values = Form.useWatch(['orders', name], form)

  console.log('values');
  console.log(values);
  if(!values) return null
  return (
    <div className={styles.betTypeCard}>
      <h4>
        { values.name }
      </h4>
      <div>
        {renderTypeForm(values.type, props)}
      </div>
      <div>
        <Space split={','}>
          <span>单价 {values.unitPrice} 元</span>
          <span>共 {values.data?.length} 注</span>
          <span>
            倍数：
            <FormItem {...restField} name={[name, 'times']} label={'倍数'} initialValue={1} noStyle>
              <InputNumber size={'small'} style={{ width: 58 }} min={1} variant="filled" controls={false}/>
            </FormItem>
          </span>
          <span>
            <FormItem noStyle>
              <span>
                合计总价：<span style={{ color: 'var(--primary)', fontWeight: 600}}>{values.unitPrice * values.data?.length * values.times}</span>元
              </span>
            </FormItem>
          </span>
        </Space>
      </div>
    </div>
  )
}
export default Bet
