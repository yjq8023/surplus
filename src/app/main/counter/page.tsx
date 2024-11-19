'use client'
import DirectBet from "@/components/BetTypes/DirectBet";
import GroupBet from "@/components/BetTypes/GroupBet";
import { Form, Space, InputNumber, Row, Col, Button, Input, Empty } from 'antd'
import styles from "./index.module.scss";
import {betTypes} from "@/config";
import YiMaDIngWei from "@/components/BetTypes/YiMaDIngWei";

const FormItem = Form.Item

const Counter = () => {
  const [form] = Form.useForm()
  const data = Form.useWatch('data', form)
  const onAdd = (d: any) => {
    console.log('onAdd');
    console.log(d);
    const data = form.getFieldValue('data') || []
    data.push(d)
    form.setFieldsValue({
      data
    })
  }

  return (
    <Row className={styles.page} gutter={24}>
      <Col flex={'1 0'}  className={styles.config}>
        {
          betTypes.map((item) => {
            return (
              <BetTypeCard key={item.type} title={item.name} type={item.type} unitPrice={item.unitPrice} onAdd={onAdd} />
            )
          })
        }
      </Col>
      <Col flex={'0 0 580px'}>
        <div className={styles.order}>
          <h4>订单信息</h4>
          <Form form={form} layout={'vertical'}>
            <FormItem label={'客户'} name={'user'}>
              <Input style={{ width: 320 }} placeholder={'请输入/选择客户'} />
            </FormItem>
            <FormItem label={'订单内容'} name={'data'}>
              <OrderContent />
            </FormItem>
            <FormItem>
              <Button type={'primary'}>提交</Button>
            </FormItem>
          </Form>
        </div>
      </Col>
    </Row>
  )
}

const OrderContent = (props: any) => {
  const { value = [] } = props
  const getTitle = (type) => {
    return betTypes.filter((item) => {
      return item.type === type
    })[0].name
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
            return (
              <div key={index} className={styles.orderContentItem}>
                <div className={styles.orderContentItemTitle}>
                  {index + 1}.&nbsp;
                  {getTitle(item.type)}，共 {item.data?.length} 注，{item.times} 倍，合计 {total} 元
                </div>
                <Space wrap>
                  {item.data.map((item, index: number) => {
                    return (
                      <span key={index} className={styles.orderContentDataItem}>
                      {Array.isArray(item) ? item.join('') : item}
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
        !!value.length && <div className={styles.total}>共{value.length}单，总价 100元</div>
      }
    </div>
  )
}



const RenderTypeForm = (props: any) => {
  const { type } = props;
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
  if(type === 'dd') {
    return <DirectBet length={1} count={1} {...props}/>
    // return  <DuXuan {...props}/>
  }
  if(type === 'ymdw') {
    return <YiMaDIngWei count={1} {...props}/>
  }
  if(type === 'emdw') {
    return <YiMaDIngWei count={2} {...props}/>
  }
  return 'todo'
}

const BetTypeCard = (props: any) => {
  const { title, type, unitPrice, onAdd } = props;
  const [form] = Form.useForm()

  const times = Form.useWatch('times', form)
  const data = Form.useWatch('data', form)
  const total = unitPrice * data?.length * times

  const onFinish = (formValues: any) => {
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
    if(!str) return
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
          { title }
        </h4>
        <div style={{ maxWidth: '100%'}}>
          <RenderTypeForm name={'data'} type={type} />
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
                <InputNumber size={'small'} style={{ width: 58 }} min={1} variant="filled" controls={false}/>
              </FormItem>
            </span>
            <span>
              <FormItem noStyle>
                <span>
                  合计：
                  <span style={{ color: 'var(--primary)', fontWeight: 600}}>
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
