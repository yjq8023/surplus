import Image from "next/image";
import styles from "./page.module.css";
import { Button } from 'antd'

export default function Home() {
  return (
    <div className={styles.page}>
      <Button>下注</Button>
    </div>
  );
}
