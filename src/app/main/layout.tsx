'use client'
import React, { Suspense } from 'react';
import { Layout, Menu } from 'antd';
import { AccountBookOutlined, MoneyCollectOutlined, WechatOutlined, FileDoneOutlined } from '@ant-design/icons'
import { useRouter, usePathname } from 'next/navigation'
import styles from './layout.module.scss'

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }: any) => {
  const router = useRouter()
  const pathname = usePathname()

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
        <Header className={styles.header}></Header>
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
