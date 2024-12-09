'use client'
import { useState, useEffect, useRef } from 'react';
import { Space, Table, Form, Input, Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import AddModal from './components/AddModal';
import { deleteClient, getClient } from '@/services/client';
import Link from 'next/link';

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
    getClient({
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
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 300,
    },
    {
      title: '微信号/手机号',
      dataIndex: 'wechat',
      key: 'wechat',
      width: 300,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 180,
      render(text: string, record: any) {
        return (
          <Space>
            <Link href={`/main/orders?clientId=${record.id}`}>订单列表</Link>
            <a onClick={() => handleAdd(record)}>修改</a>
            <a onClick={() => handleDelete(record)}>删除</a>
          </Space>
        )
      }
    }
  ]

  return (
    <div>
      <div style={{ paddingTop: 12 }}>
        <Form form={searchForm} onFinish={() => handleSearch()} onReset={() => handleSearch()}>
          <Space size={24}>
            <Form.Item label="名称" name={'name'}>
              <Input placeholder={'请输入客户名称'} style={{ width: 240 }} />
            </Form.Item>
            <Form.Item label="微信号/手机号" name={'wechat'}>
              <Input placeholder={'请输入客户微信号/手机号'} style={{ width: 240 }} />
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
          客户列表
          <span style={{ marginLeft: 12, fontSize: 14, fontWeight: 400 }}>
            共 {total} 位客户，点击&nbsp;
            <Button size='small' type="primary" shape="circle" icon={<PlusOutlined />} onClick={handleAdd} />
            &nbsp;添加新客户
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