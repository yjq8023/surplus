'use client'
import { Input, Button, Space, Form } from 'antd'
import { useState } from 'react'
import { PlusOutlined, CloseCircleFilled } from '@ant-design/icons'
import styles from './index.module.scss'
import {isNull} from "@/utils";

const GroupBet = (props: any) => {
  const { name, count = 1 } = props
  return (
    <div className={styles.directBet}>
      <Form.List name={name} initialValue={[['*','*','*']]}>
        {(fields, { add, remove }, { errors }) => (
          <Space wrap size={[14, 0]}>
            {fields.map((field, index) => (
              <Form.Item
                required={false}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  validateTrigger={['onChange']}
                  rules={[{
                    validator: (rule, val) => {
                      if(val.filter(i => i !== '*').length === count) {
                        return Promise.resolve()
                      }
                      return Promise.reject('请输入' + count + '位数字')
                    }
                  }]}
                  noStyle
                >
                  <GroupBetItem onRemove={() => remove(field.name)} />
                </Form.Item>
              </Form.Item>

            ))}
            <Form.Item>
              <Button className={styles.addBtn} onClick={() => add()} size={'small'} color="primary" variant="filled"><PlusOutlined /></Button>
            </Form.Item>
          </Space>
        )}
      </Form.List>
    </div>
  )
}

const GroupBetItem = (props: any) => {
  const { onRemove, value = ['*', '*', '*'], onChange } = props
  const [keys] = useState([1,2,3])

  const handleChange = (index: number, e: any) => {
    const val = e.target.value
    const newValue: any[] = [...value]
    newValue[index] = val === '' ? '*' : val
    onChange(newValue)
    setTimeout(() => {
      e.target.select()
      e.currentTarget.select()
    }, 500)
  }
  const handleFocus = (e: any) => {
    setTimeout(() => {
      e.target.select()
    }, 150)
  }
  return (
    <div className={styles.item}>
      <Space>
        {
          keys.map((key, index) => {
            return (
              <Input
                key={key}
                onFocus={handleFocus}
                value={value[index]}
                onChange={(e: any) => handleChange(index, e)}
                size={'small'}
                min={0}
                max={9}
              />
            )
          })
        }
      </Space>
      {/*<Input.OTP onBlur={handleBlur} value={Array.isArray(value) && value.join('')} onChange={handleChange} formatter={(v) => isNull(v) ? '*' : v } size={'small'} length={3}  />*/}
      <CloseCircleFilled  className={styles.icon} onClick={onRemove}/>
    </div>
  )
}

export default GroupBet
