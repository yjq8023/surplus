'use client'
import React from "react";
import Link from "next/link";
import { Form, Input, Button, Checkbox } from 'antd'
import styles from './index.module.scss'

const Login = () => {
  return (

    <div 
    className={styles.login}>
      <div className={styles.form}>
        <div className={styles.title}>账号登录</div>
        <div className={styles.body}>
          <Form layout={'vertical'}>
            <Form.Item name={'username'} label={'用户名'}>
              <Input placeholder={'请输入用户名'} />
            </Form.Item>
            <Form.Item name={'password'} label={'密码'}>
              <Input.Password placeholder={'请输入密码'} />
            </Form.Item>
            <Form.Item name={'agreement'}>
              <Checkbox>我同意并遵守<Link href={'/agreement'} target={'_blank'}>《盈余平台服务协议》</Link></Checkbox>
            </Form.Item>
            <Form.Item>
              <Button block type={'primary'}>登录</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Login;
