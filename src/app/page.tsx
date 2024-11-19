'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { Button } from 'antd'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'

export default function Home() {

  const getSession = async () => {
    const session = await auth()
    console.log(session)
  }
  return (
    <div className={styles.page}>
      home12
      <Button onClick={getSession}>获取session</Button>
    </div>
  );
}
