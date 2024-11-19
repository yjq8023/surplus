'use client'
import React from "react";
import Link from "next/link";
import { Form, Input, Button, Checkbox, message } from 'antd'
import { signIn } from 'next-auth/react'
import styles from './index.module.scss'
import { useRouter } from 'next/navigation'

const Login = () => {
  const [form] = Form.useForm()
  const router = useRouter()
  const handleLogin = async () => {
    try {
      const formValues = await form.validateFields();
      const res = await signIn('credentials', {
        ...formValues,
        redirect: false
      })
      if (!res?.error) {
        router.push('/')
      } else {
        message.error('登录失败，请检查用户名/密码是否正确')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className={styles.login}>
      <div className={styles.form}>
        <div className={styles.title}>账号登录</div>
        <div className={styles.body}>
          <Form form={form} layout={'vertical'} onFinish={handleLogin}>
            <Form.Item name={'username'} label={'用户名'} rules={[{
              required: true,
              message: '请输入用户名'
            }]}>
              <Input placeholder={'请输入用户名'} />
            </Form.Item>
            <Form.Item name={'password'} label={'密码'} rules={[{
              required: true,
              message: '请输入密码'
            }]}>
              <Input.Password placeholder={'请输入密码'} />
            </Form.Item>
            <Form.Item name={'agreement'} initialValue={true} valuePropName="checked" rules={[{
              validator(rule, value) {
                if (value) return Promise.resolve()

                return Promise.reject('请阅读同意服务协议')
              },
              type: 'boolean'
            }]}>
              <Checkbox>我同意并遵守<Link href={'/agreement'} target={'_blank'}>《盈余平台服务协议》</Link></Checkbox>
            </Form.Item>
            <Form.Item>
              <Button block type={'primary'} htmlType="submit">登录</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div >
  )
}

export default Login;
