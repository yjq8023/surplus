'use client'
import React, { Suspense, useEffect } from 'react';
import { Layout, Menu, Space } from 'antd';
import { AccountBookOutlined, MoneyCollectOutlined, WechatOutlined, FileDoneOutlined } from '@ant-design/icons'
import { useRouter, usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import styles from './layout.module.scss'
import { LogoutOutlined } from '@ant-design/icons'

const { Header, Sider, Content } = Layout;
import { useSession } from "next-auth/react"

const MainLayout = ({ children }: any) => {
  const {data, status} = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if(status === 'authenticated') {
      router.push('/main/periods')
    }
    if(status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status])

  const handleLogOut = () => {
    signOut({
      redirectTo: '/login'
    })
  }

  const menuItems = [
    {
      key: '/main/periods',
      label: '周期',
      icon: <AccountBookOutlined />
    },
    {
      key: '/main/counter',
      label: '打单',
      icon: <MoneyCollectOutlined />
    },
    {
      key: '/main/orders',
      label: '历史订单',
      icon: <FileDoneOutlined />
    },
    {
      key: '/main/client',
      label: '客户',
      icon: <WechatOutlined />
    }
  ]

  const handleSelect = (item: any) => {
    const { key } = item;
    router.push(key)
  }
  return (
    <Layout className={styles.layout}>
      <Sider className={styles.sider} collapsed={true}>
        <div className={styles.logo}>
          盈余
        </div>
        <div className={styles.menu}>
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            style={{ borderRight: 0 }}
            items={menuItems}
            onSelect={handleSelect}
          />
        </div>
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <Space>
            <span>
              欢迎您，{data?.user?.name}。
            </span>
            <LogoutOutlined className={styles.logout} title='退出登录' onClick={handleLogOut} />
          </Space>
          
        </Header>
        <Content className={styles.content}>
          <Suspense fallback={'loding...'}>
            {children}
          </Suspense>
        </Content>
        {/*<Footer className={styles.footer}>Footer</Footer>*/}
      </Layout>
    </Layout>
  )
}

export default MainLayout
