'use client'
import { Input, Button, Space, Form } from 'antd'
import { useEffect } from 'react'
import { PlusOutlined, CloseCircleFilled } from '@ant-design/icons'
import styles from './index.module.css'
import {isNull} from "@/utils";

const DirectBet = (props: any) => {
  const { name, count = 3, length = 3, ...other } = props
  return (
    <div className={styles.directBet}>
      <Form.List name={name} initialValue={['']} {...other}>
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
                  rules={[
                    {
                      validator:(rule, val) => {
                        if(!Array.isArray(val)) {
                          return Promise.reject('请输入' + count + '位数字')
                        }
                        if(val.filter((v: number) => !isNull(v)).length === count) {
                          return Promise.resolve()
                        }
                        return Promise.reject('请输入' + count + '位数字')
                      }
                    }
                  ]}
                  noStyle
                >
                  <DirectBetItem length={length} onRemove={() => remove(field.name)} />
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

const DirectBetItem = (props: any) => {
  const { onRemove, ...other } = props
  return (
    <div className={styles.item}>
      <ArrayInputOpt {...other}  />
      <CloseCircleFilled  className={styles.icon} onClick={onRemove}/>
    </div>
  )
}

const ArrayInputOpt = (props: any) => {
  const { value = [], onChange, ...other } = props;
  useEffect(() => {
    if(Array.isArray(value) && value.length > props.length) {
      onChange(value.splice(0, props.length))
    }
  }, [value])
  const handleChange = (v: string) => {
    onChange(v.split(''))
  }
  return <Input.OTP value={Array.isArray(value) && value.join('')} onChange={handleChange} formatter={(v) => isNull(v) ? '*' : v } size={'small'} {...other}  />
}

export default DirectBet
