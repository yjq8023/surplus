'use client'
import { InputNumber, Button, Space, Form } from 'antd'
import { useState } from 'react'
import { PlusOutlined, CloseCircleFilled } from '@ant-design/icons'
import styles from './index.module.scss'
import { isNull } from "@/utils";

const GroupBet = (props: any) => {
  const { name, count = 1, rules } = props
  return (
    <div className={styles.directBet}>
      <Form.List name={name} initialValue={[['', '', '']]}>
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
                  rules={rules}
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
  const { onRemove, value = ['', '', ''], onChange } = props
  const [keys] = useState([1, 2, 3])

  const handleChange = (index: number, val: any) => {
    const newValue: any[] = [...value]
    newValue[index] = val
    onChange(newValue)
  }
  const placeholder = ['百', '十', '个']
  return (
    <div className={styles.item}>
      <Space>
        {
          keys.map((key, index) => {
            return (
              <InputNumber
                key={key}
                value={value[index]}
                onChange={(e: any) => handleChange(index, e)}
                size={'small'}
                min={0}
                max={9}
                placeholder={placeholder[index]}
                controls={false}
              />
            )
          })
        }
      </Space>
      {/*<Input.OTP onBlur={handleBlur} value={Array.isArray(value) && value.join('')} onChange={handleChange} formatter={(v) => isNull(v) ? '*' : v } size={'small'} length={3}  />*/}
      <CloseCircleFilled className={styles.icon} onClick={onRemove} />
    </div>
  )
}

export default GroupBet
