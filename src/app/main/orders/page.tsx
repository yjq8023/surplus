'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Space, Table, Form, Select, Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import AddModal from './components/AddModal';
import { deleteClient, getClient } from '@/services/client';
import { exportOrders, getOrders } from '@/services/orders';
import dayjs from 'dayjs'
import { isNull } from '@/utils';
import styles from './index.module.scss';
import { betTypeConfig } from '@/config';
import PeriodsSelect from '@/components/PeriodsSelect';
import ClientSelect from '@/components/ClientSelect';

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


  const handleGetListData: any = (page = 1) => {
    const searchFormData = searchForm.getFieldsValue();
    setPage(page)
    getOrders({
      ...searchFormData,
      pageSize,
      page
    }).then((res) => {
      const list = res.data.reduce((arr: any[], item: any, i: number) => {
        return arr.concat(item.tickets.map((citem: any, index: any) => {
          return {
            ...citem,
            rowSpan: index === 0 ? item.tickets.length : 0,
            index: i + 1,
            clientName: item.client.name,
            periodName: item.period.name
          }
        }));
      }, []);
      setListData(list);
      setTotal(res.total);
    })
  }

  const handleExport = () => {
    const searchFormData = searchForm.getFieldsValue();
    exportOrders(searchFormData)
  }

  const renderNumber = (type: string, data: any) => {
    const isNeedEmpty = ['ymdw', 'emdw'].includes(type)
    const d = JSON.parse(data)
    if (!Array.isArray(d)) {
      return ''
    }
    return (
      <div className={styles.tgas}>
        <Space>
          {JSON.parse(data).map((item: any, index: number) => {
            let numbers = [...item];
            if (isNeedEmpty) {
              numbers = item.map((i: any) => {
                return isNull(i) ? '-' : i
              })
            }
            return (
              <span key={index} className={styles.numberItem}>
                {Array.isArray(numbers) ? numbers.join('') : 'error'}
              </span>
            )
          })}
        </Space>
      </div>
    )
  }
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      onCell(record: any, index: number) {
        return {
          rowSpan: record.rowSpan
        }
      },
      align: 'center',
      fixed: 'left'
    },
    {
      title: '客户名称',
      dataIndex: 'clientName',
      key: 'clientName',
      width: 130,
      onCell(record: any, index: number) {
        return {
          rowSpan: record.rowSpan
        }
      },
      fixed: 'left'
    },
    {
      title: '周期',
      dataIndex: 'periodName',
      key: 'periodName',
      width: 130,
      onCell(record: any, index: number) {
        return {
          rowSpan: record.rowSpan
        }
      }
    },
    {
      title: '打单时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render(text: string) {
        return dayjs(text).format('YYYY-MM-DD HH:mm:ss')
      },
      onCell(record: any, index: number) {
        return {
          rowSpan: record.rowSpan
        }
      }
    },
    {
      title: '投注类型',
      dataIndex: 'type',
      width: 140,
      key: 'type',
      render(text: string, record: any) {
        return betTypeConfig[record.type].name
      }
    },
    {
      title: '投注号码',
      dataIndex: 'data',
      key: 'data',
      width: 320,
      render(text: string, record: any) {
        return renderNumber(record.type, record.data)
      }
    },
    {
      title: '投注倍数',
      dataIndex: 'times',
      key: 'times',
      width: 80,
      render(text: string) {
        return text + '倍'
      }
    },
    {
      title: '投注金额',
      dataIndex: 'total',
      key: 'total',
      width: 80,
      render(text: string) {
        return text + '元'
      }
    },
    {
      title: '是否中奖',
      dataIndex: 'isPrize',
      key: 'isPrize',
      width: 80,
      render(text: string, record: any) {
        return record.isPrize ? '是' : '否'
      }
    },
    {
      title: '中奖号码',
      dataIndex: 'prizeNumber',
      key: 'prizeNumber',
      width: 320,
      render(t: string, record: any) {
        return renderNumber(record.type, record.prizeNumber)
      }
    },
    {
      title: '中奖金额',
      dataIndex: 'prizeAmount',
      key: 'prizeAmount',
      width: 80,
    }
  ]
  return (
    <div>
      <div style={{ paddingTop: 12 }}>
        <Form form={searchForm} onFinish={() => handleSearch()} onReset={() => handleSearch()}>
          <Space size={24}>
            <Form.Item label="周期" name={'periodId'}>
              <PeriodsSelect style={{ width: 240 }} />
            </Form.Item>
            <Form.Item label="客户" name={'clientId'}>
              <ClientSelect placeholder={'请选择客户'} style={{ width: 240 }} allowClear />
            </Form.Item>
            <Form.Item label="是否中奖" name={'isPrize'}>
              <Select placeholder={'请选择是否中奖'} options={[
                {
                  label: '是',
                  value: '1'
                },
                {
                  label: '否',
                  value: '0'
                }
              ]} style={{ width: 240 }} allowClear />
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
          <div className={styles.action}>
            <Button type='primary' onClick={handleExport}>导出</Button>
          </div>
        </div>
        <div>
          <Table scroll={{ x: 1700 }} dataSource={listData} columns={columns} size={'small'} bordered pagination={false}></Table>
        </div>
      </div>
      <AddModal ref={addModalRef} onCreated={handleGetListData} />
    </div>
  )
}

export default Client