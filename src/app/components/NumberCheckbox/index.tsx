import React, { useEffect } from "react";
import { Space } from 'antd'
import styles from './index.module.css'
import classnames from 'classnames'

const NumberCheckbox = (props: any) => {
  const { value = [], onChange } = props
  const numbers = [0,1,2,3,4,5,6,7,8,9]

  useEffect(() => {
    const uniqueArray = Array.from(new Set(value))
    if(uniqueArray.length !== value.length) {
      onChange(uniqueArray)
    }
  }, [value])

  const handleClick = (num: number) => {
    if(value.includes(num)) {
      onChange(value.filter((item: number) => item !== num))
    } else {
      onChange([...value, num])
    }
  }

  return (
    <div className={styles.numberCheckbox}>
      <Space>
        {
          numbers.map((number) => {
            const className = classnames({
              [styles.checkItem]: true,
              [styles.active]: value.includes(number),
            })
            return <span onClick={() => handleClick(number)} className={className} key={number}>{number}</span>
          })
        }
      </Space>
    </div>
  )
}

export default NumberCheckbox
