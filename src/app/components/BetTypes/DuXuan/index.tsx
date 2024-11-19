'use client'
import { InputNumber, Button, Space, Form } from 'antd'
import { PlusOutlined, CloseCircleFilled } from '@ant-design/icons'
import styles from './index.module.scss'

const GroupBet = (props: any) => {
  const { name, min } = props
  return (
    <div className={styles.directBet}>
      <Form.List name={name} initialValue={['']}>
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
                      if(val.length < min) {
                        return Promise.reject('最少选择' + min + '位数字')
                      }
                      return Promise.resolve()
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
  const { onRemove, ...other } = props
  return (
    <div className={styles.item}>
      <InputNumber {...other} size={'small'} min={1} controls={false}/>
      <CloseCircleFilled  className={styles.icon} onClick={onRemove}/>
    </div>
  )
}

export default GroupBet
