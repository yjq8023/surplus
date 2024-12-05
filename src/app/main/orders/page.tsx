'use client'
import { useState, useEffect, useRef } from 'react';
import { Space, Table, Form, Input, Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import AddModal from './components/AddModal';
import { deleteClient, getClient } from '@/services/client';
import { getOrders } from '@/services/orders';

const Client = () => {
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [listData, setListData] = useState<any[]>([])
  const [searchForm] = Form.useForm()

  const addModalRef = useRef<any>()

  useEffect(() => {
    handleGetListData()
  }, [])

  const handleSearch = () => {
    handleGetListData()
  }

  const handleAdd = (item?: any) => {
    addModalRef.current?.open(item)
  }

  const handleGetListData: any = (page = 1) => {
    const searchFormData = searchForm.getFieldsValue();
    setPage(page)
    getOrders({
      ...searchFormData,
      pageSize,
      page
    }).then((res) => {
      setListData(res.data);
      setTotal(res.total);
    })
  }

  const handleDelete = (item: any) => {
    Modal.confirm({
      title: '确认删除？',
      content: '删除客户及其所有订单数据，该操作无法恢复',
      async onOk() {
        await deleteClient(item.id)
        handleGetListData()
      }
    })
  }


  const columns = [
    {
      title: '周期',
      dataIndex: 'period.name',
      key: 'period.name',
      width: 140,
      render(text: string, record: any) {
        return record.period.name
      }
    },
    {
      title: '客户名称',
      dataIndex: 'client',
      key: 'client',
      width: 120,
      render(text: string, record: any) {
        return record.client.name
      }
    },
    {
      title: '订单内容',
      dataIndex: 'remark',
      key: 'remark',
      render(text: string, record: any) {
        return JSON.stringify(record.tickets)
      }
    }
  ]

  return (
    <div>
      <div style={{ paddingTop: 12 }}>
        <Form form={searchForm} onFinish={() => handleSearch()} onReset={() => handleSearch()}>
          <Space size={24}>
            <Form.Item label="周期" name={'wechat'}>
              <Input placeholder={'请输入客户微信号/手机号'} style={{ width: 240 }} />
            </Form.Item>
            <Form.Item label="客户" name={'name'}>
              <Input placeholder={'请输入客户名称'} style={{ width: 240 }} />
            </Form.Item>
            <Form.Item>
              <Space size={12}>
                <Button htmlType='reset'>重置</Button>
                <Button type={'primary'} htmlType='submit'>搜索</Button>
              </Space>
            </Form.Item>
          </Space>
        </Form>
      </div>
      <div>
        <div className={'sub-title'} style={{ paddingRight: 12, marginBottom: 24 }}>
          订单列表
          <span style={{ marginLeft: 12, fontSize: 14, fontWeight: 400 }}>
            共 {total} 笔订单
          </span>
        </div>
        <div>
          <Table dataSource={listData} columns={columns}></Table>
        </div>
      </div>
      <AddModal ref={addModalRef} onCreated={handleGetListData} />
    </div>
  )
}

export default Client