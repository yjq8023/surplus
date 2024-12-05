'use client'
import styles from "./page.module.css";
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push('/main/periods')
  }, [])
  return (
    <div className={styles.page}>
      home
    </div>
  );
}
