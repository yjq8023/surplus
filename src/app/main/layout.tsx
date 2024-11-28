'use client'
import React from 'react';
import { Layout, Menu } from 'antd';
import { ProfileOutlined, MoneyCollectOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import styles from './layout.module.scss'

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }: any) => {
  const router = useRouter()
  const menuItems = [
    {
      key: '/main/counter',
      label: '计算器',
      icon: <MoneyCollectOutlined />
    },
    {
      key: '/main/periods',
      label: '期数',
      icon: <ProfileOutlined />
    }
  ]

  const handleSelect = (item: any) => {
    console.log(item);
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
            defaultSelectedKeys={['1']}
            style={{ borderRight: 0 }}
            items={menuItems}
            onSelect={handleSelect}
          />
        </div>
      </Sider>
      <Layout>
        <Header className={styles.header}>Header</Header>
        <Content className={styles.content}>
          {children}
        </Content>
        {/*<Footer className={styles.footer}>Footer</Footer>*/}
      </Layout>
    </Layout>
  )
}

export default MainLayout
