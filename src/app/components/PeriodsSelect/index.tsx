import { useState, useEffect } from 'react'
import { getPeriodsOptions } from '@/services/periods'
import { Select, Tag } from 'antd'
const PeriodsSelect = (props: any) => {
  const [options, setOptions] = useState<any>([])

  useEffect(() => {
    handleGetPeriodsOptions()
  }, [])

  const handleGetPeriodsOptions = async () => {
    const res = await getPeriodsOptions(props.searchParams)
    setOptions(res.map((item: any) => {
      const tag = item.type === 'tc' ? <Tag color={'#55acee'} style={{ marginRight: 0 }}>体</Tag> : <Tag color={'#f50'} style={{ marginRight: 0 }}>福</Tag>
      return {
        label: (
          <div>
            <span>{`${item.name}（${item.date}）`}</span>
            {tag}
          </div>
        ),
        value: item.id
      }
    }))
  }

  return (
    <Select options={options} placeholder={'请选择周期'} {...props}></Select>
  )
}

export default PeriodsSelect