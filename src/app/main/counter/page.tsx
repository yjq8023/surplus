'use client'
import { useEffect, useState } from 'react'
import DirectBet from "@/components/BetTypes/DirectBet";
import GroupBet from "@/components/BetTypes/GroupBet";
import { Form, Space, InputNumber, Row, Col, Button, Input, Empty, Select, Tag, message, Tooltip } from 'antd'
import styles from "./index.module.scss";
import { betTypes } from "@/config";
import YiMaDIngWei from "@/components/BetTypes/YiMaDIngWei";
import { getPeriodsOptions } from '@/services/periods'
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useParams, useSearchParams } from 'next/navigation'
import { getClientOptions } from '@/services/client';
import { createOrder } from '@/services/orders';
import { isNull } from '@/utils';
import ClientSelect from '@/components/ClientSelect';
import PeriodsSelect from '@/components/PeriodsSelect';

const FormItem = Form.Item

const Counter = () => {
  const [submiting, setSubmiting] = useState(false)
  const [form] = Form.useForm()
  const params = useSearchParams();
  const periodsId = params.get('periodsId')

  const onAdd = (d: any) => {
    const data = form.getFieldValue('tickets') || []
    data.push(d)
    form.setFieldsValue({
      tickets: data
    })
  }

  const handleSubmitOrder = async (formData: any) => {
    console.log(formData);
    setSubmiting(true)
    const { periodId, clientId, tickets } = formData
    try {
      const res = await createOrder({
        periodId, clientId, tickets
      })
      message.success('提交订单成功！')
      form.setFieldsValue({
        tickets: []
      })
      setSubmiting(false)
    } catch {
      setSubmiting(false)
    }
  }

  return (
    <Row className={styles.page} gutter={24}>
      <Col flex={'1 0'} className={styles.config}>
        {
          betTypes.map((item) => {
            return (
              <BetTypeCard key={item.type} config={item} onAdd={onAdd} />
            )
          })
        }
      </Col>
      <Col flex={'0 0 580px'}>
        <div className={styles.order}>
          <h4>订单信息</h4>
          <Form form={form} layout={'vertical'} onFinish={handleSubmitOrder}>
            <FormItem label={'周期'} name={'periodId'} initialValue={periodsId} rules={[{ required: true, message: '请选择周期' }]}>
              <PeriodsSelect searchParams={{ disabled: '0' }} />
            </FormItem>
            <FormItem
              label={(
                <div>
                  客户
                  <Button icon={<PlusOutlined />} color='primary' size='small' variant="filled" style={{ marginLeft: 8 }}></Button>
                </div>
              )}
              name={'clientId'}
              rules={[{ required: true, message: '请选择客户' }]}
            >
              <ClientSelect />
            </FormItem>
            <FormItem label={'订单内容'} name={'tickets'} rules={[{ type: 'array', required: true, message: '请添加订单' }]}>
              <OrderContent />
            </FormItem>
            <div style={{ padding: '20px 48px 0' }}>
              <Button loading={submiting} size='large' block type={'primary'} htmlType='submit'>提交</Button>
            </div>
          </Form>
        </div>
      </Col>
    </Row >
  )
}

const OrderContent = (props: any) => {
  const { value = [] } = props
  const getTitle = (type: string) => {
    return betTypes.filter((item) => {
      return item.type === type
    })[0].name
  }

  const getTotal = () => {
    return value.reduce((total: number = 0, item: any) => {
      return total + item.total;
    }, 0);
  }

  return (
    <div>
      <div className={styles.orderContent}>
        {
          !value?.length && <Empty description={'请添加订单数据'} />
        }
        {
          value.map((item: any, index: number) => {
            const { total } = item
            const isNeedEmpty = ['ymdw', 'emdw'].includes(item.type)
            return (
              <div key={index} className={styles.orderContentItem}>
                <div className={styles.orderContentItemTitle}>
                  {index + 1}.&nbsp;
                  {getTitle(item.type)}，共 {item.data?.length} 注，{item.times} 倍，合计 {total} 元
                </div>
                <Space wrap>
                  {item.data.map((item: any, index: number) => {
                    let numbers = [...item];
                    if (isNeedEmpty) {
                      numbers = item.map((i: any) => {
                        return isNull(i) ? '-' : i
                      })
                    }
                    return (
                      <span key={index} className={styles.orderContentDataItem}>
                        {Array.isArray(numbers) ? numbers.join('') : 'error'}
                      </span>
                    )
                  })}
                </Space>
              </div>
            )
          })
        }
      </div>
      {
        !!value.length && <div className={styles.total}>共{value.length}单，总价 {getTotal()}元</div>
      }
    </div>
  )
}



const RenderTypeForm = (props: any) => {
  const { type, validator } = props;
  const rules = [{ validator: (rule: any, value: any) => validator(value) }]
  if (type === 'zx') {
    return <DirectBet rules={rules} {...props} />
  }
  if (type === 'zxzs') {
    return <DirectBet rules={rules} {...props} />
  }
  if (type === 'zxzl') {
    return <DirectBet rules={rules} {...props} />
  }
  if (type === 'zs') {
    return <GroupBet rules={rules} min={2} {...props} />
  }
  if (type === 'zl') {
    return <GroupBet rules={rules} min={3} {...props} />
  }
  if (type === 'dd') {
    return <DirectBet rules={rules} length={1} {...props} />
  }
  if (type === 'ymdw') {
    return <YiMaDIngWei rules={rules} count={1} {...props} />
  }
  if (type === 'emdw') {
    return <YiMaDIngWei rules={rules} count={2} {...props} />
  }
  return 'todo'
}

const BetTypeCard = (props: any) => {
  const { onAdd } = props;
  const { name, type, description, unitPrice, validator } = props.config;
  const [form] = Form.useForm()

  const times = Form.useWatch('times', form)
  const data = Form.useWatch('data', form)
  const total = unitPrice * data?.length * times

  const onFinish = (formValues: any) => {
    if (formValues.data.length === 0) {
      message.error('请添加下注内容')
      return
    }
    onAdd({
      ...formValues,
      type,
      unitPrice,
      total
    })
    form.resetFields()
  }
  const splitData = (e: any) => {
    let str = e.target.value;
    // 字符串中多个空格合并为一个
    str = str.replace(/\s+/g, '/')
    if (!str) return
    // 以斜杠、逗号、空格等特殊字符为分隔符分割字符串
    // 匹配字符串是否全是数字
    const arr = str.split(/[\/,.。，\s]/).filter((item: string) => /^\d+(\/\d+)*$/.test(item))
    form.setFieldsValue({
      data: arr.map((item: string) => item.split('').map(Number))
    })
  }
  return (
    <Form form={form} onFinish={onFinish}>
      <div className={styles.betTypeCard}>
        <h4>
          {name}
          <Tooltip title={description} color='#108ee9'>
            <QuestionCircleOutlined />
          </Tooltip>
        </h4>
        <div style={{ maxWidth: '100%' }}>
          <RenderTypeForm name={'data'} type={type} validator={validator} />
        </div>
        <div>
          <FormItem name={'msg'} noStyle>
            <Input.TextArea rows={1} autoSize onChange={splitData} variant="filled" allowClear style={{ width: '100%', marginBottom: 6 }} size={'small'} placeholder={'输入文本快捷添加，以空格分隔多注。如：123 231'}></Input.TextArea>
          </FormItem>
          <Space split={' '}>
            <span>单价 {unitPrice} 元</span>
            <span>共 {data?.length} 注</span>
            <span>
              倍数：
              <FormItem name={'times'} label={'倍数'} initialValue={1} noStyle>
                <InputNumber size={'small'} style={{ width: 58 }} min={1} variant="filled" controls={false} />
              </FormItem>
            </span>
            <span>
              <FormItem noStyle>
                <span>
                  合计：
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    {total}
                  </span>
                  元
                </span>
              </FormItem>
            </span>
            <Button color="default" variant="filled" size={'small'} htmlType={'reset'}>
              重置
            </Button>
            <Button color="primary" variant="filled" size={'small'} htmlType={'submit'}>
              添加
            </Button>
          </Space>
        </div>
      </div>
    </Form>
  )
}


export default Counter
