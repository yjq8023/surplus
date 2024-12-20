'use client'
import { useState, useRef, useEffect } from 'react';
import { Card, Space, Form, Input, DatePicker, Button, Tag, Dropdown, Modal, Pagination } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AddModal from "@/main/periods/components/AddModal";
import { createPeriods, deletePeriods, getPeriods } from "@/services/periods";
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import lodash from 'lodash'
import OpenLotteryModal from './components/OpenLotteryModal';

const pageSize = 20;
const Periods = () => {
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [periodsData, setPeriodsData] = useState([])
  const addModalRef = useRef<any>()
  const openLotteryModalRef = useRef<any>()
  const [searchForm] = Form.useForm();

  useEffect(() => {
    handleGetListData()
  }, [])

  const handleGetListData: any = (page = 1) => {
    const searchFormData = searchForm.getFieldsValue();
    setPage(page)
    getPeriods({
      ...searchFormData,
      date: searchFormData.date ? searchFormData.date.format('YYYY-MM-DD') : '',
      pageSize,
      page
    }).then((res) => {
      setPeriodsData(res.data);
      setTotal(res.total);
    })
  }

  const handleAdd = (d?: any) => {
    addModalRef.current?.open(d)
  }

  const onCreate = (formValues: any) => {
    return createPeriods({
      ...formValues,
      date: formValues.date.format('YYYY-MM-DD')
    }).then(() => {
      handleGetListData()
    })
  }

  const handleAction = ({ key }: any, item: any) => {
    if (key === 'open') {
      console.log('open');
      openLotteryModalRef.current.open(item)
    }
    if (key === 'update') {
      handleAdd({
        id: item.id,
        name: item.name,
        date: dayjs(item.date),
        type: item.type
      })
    }
    if (key === 'delete') {
      console.log('delete');
      Modal.confirm({
        title: '确认删除？',
        content: '删除周期及其所有订单数据，该操作无法恢复',
        async onOk() {
          await deletePeriods(item.id)
          handleGetListData()
        }
      })
    }


  }
  return (
    <div>
      <div style={{ paddingTop: 12 }}>
        <Form form={searchForm} onFinish={() => handleGetListData()} onReset={() => handleGetListData()}>
          <Space size={24}>
            <Form.Item label="名称" name={'name'}>
              <Input placeholder={'请输入周期名称'} style={{ width: 240 }} />
            </Form.Item>
            <Form.Item label="日期" name={'date'}>
              <DatePicker placeholder={'请选择周期日期'} style={{ width: 240 }} />
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
          周期列表
          <span style={{ marginLeft: 12, fontSize: 14, fontWeight: 400 }}>
            共 {total} 期，点击&nbsp;
            <Button size='small' type="primary" shape="circle" icon={<PlusOutlined />} onClick={handleAdd} />
            &nbsp;创建新的周期
          </span>
        </div>

        <Space size={16} wrap>
          {
            periodsData.map((item: any) => {
              const items = [
                {
                  key: 'open',
                  label: '开奖'
                },
                {
                  key: 'update',
                  label: '修改'
                },
                {
                  key: 'delete',
                  label: '删除'
                }
              ]
              const actions: React.ReactNode[] = [
                <Button type='link' disabled={item.disabled} size='small'>
                  <Link href={`/main/counter?periodsId=${item.id}`}>打单</Link>
                </Button>,
                <Link href={`/main/orders?periodsId=${item.id}`}>订单列表</Link>,
                (
                  <Dropdown menu={{ items, onClick: (e) => handleAction(e, item) }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
                    <a onClick={(e) => e.preventDefault()}>
                      操作
                    </a>
                  </Dropdown>
                ),
              ];
              const total = item.orders.reduce((total: number = 0, item: any) => {
                const itemTotal = item.tickets.reduce((total: number = 0, item: any) => {
                  return total + item.total;
                }, 0);
                return total + itemTotal;
              }, 0);
              const clients = item.orders.map((item: any) => {
                return item.clientId
              });
              const tags = (
                <div>
                  {
                    item.disabled ? (
                      <Tag>已开奖</Tag>
                    ) : (
                      <Tag color='green'>进行中</Tag>
                    )
                  }
                  {
                    item.type === 'tc' ?
                      <Tag color={item.disabled ? '' : '#55acee'} style={{ marginRight: 0 }}>体彩</Tag> :
                      <Tag color={item.disabled ? '' : '#f50'} style={{ marginRight: 0 }}>福彩</Tag>
                  }
                </div>
              )
              return (
                <Card key={item.id} actions={actions} title={item.name} extra={tags} style={{ width: 300 }}>
                  <p>日期：{item.date}</p>
                  <p>客户数(人)：{lodash.uniq(clients).length}</p>
                  <p>订单数(单)：{item.orders.length}</p>
                  <p>总金额(元)：{total}</p>
                  <p>开奖号码：{item.lotteryNumber ? item.lotteryNumber : '未开奖'}</p>
                </Card>
              )
            })
          }
        </Space>
        <div style={{ paddingTop: 24 }}>
          <Pagination
            current={page}
            total={total}
            defaultCurrent={1}
            pageSize={pageSize}
            onChange={(page) => handleGetListData(page)}
          />
        </div>
        <AddModal ref={addModalRef} onCreate={onCreate} />
        <OpenLotteryModal ref={openLotteryModalRef} onSuccess={handleGetListData} />
      </div>
    </div>
  )
}

export default Periods
