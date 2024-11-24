'use client'
import { Input, Button, Space, Form } from 'antd'
import { PlusOutlined, CloseCircleFilled } from '@ant-design/icons'
import styles from './index.module.css'

const DirectBet = (props: any) => {
  const { name } = props
  return (
    <div className={styles.directBet}>
      <Form.List name={name} initialValue={['']}>
        {(fields, { add, remove }, { errors }) => (
          <Space wrap>
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
                      required: true,
                      whitespace: true,
                      message: "请输入",
                    },
                  ]}
                  noStyle
                >
                  <DirectBetItem onRemove={() => remove(field.name)} />
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
      <Input.OTP size={'small'} length={3} {...other}  />
      <CloseCircleFilled  className={styles.icon} onClick={onRemove}/>
    </div>
  )
}

export default DirectBet
