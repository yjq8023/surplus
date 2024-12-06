import { useState, useEffect } from 'react'
import { Select, Tag } from 'antd'
import { getClientOptions } from '@/services/client'
const ClientSelect = (props: any) => {
  const [options, setOptions] = useState<any>([])

  useEffect(() => {
    handleGetPeriodsOptions()
  }, [])

  const handleGetPeriodsOptions = async () => {
    const res = await getClientOptions({})
    setOptions(res.map((item: any) => {
      return {
        label: item.name,
        value: item.id
      }
    }))
  }

  return (
    <Select options={options} placeholder={'请选择客户'} {...props}></Select>
  )
}

export default ClientSelect