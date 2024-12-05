import React, { useState, useImperativeHandle } from 'react'
import { Modal, Form, Input, Radio, DatePicker } from 'antd'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { createClient } from '@/services/client';
dayjs.locale('zh-cn');

const AddModal = (props: any, ref: any) => {
  const { onCreated } = props
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const id = Form.useWatch('id', form)

  useImperativeHandle(ref, () => ({
    open: (d = {}) => {
      setOpen(true)
      setTimeout(() => {
        form.setFieldsValue(d)
      }, 300)
    },
    close: () => setOpen(false),
  }))

  const onFinish = async (formData: any) => {
    const res = await createClient(formData)
    setOpen(false)
    onCreated && onCreated(res)
  }
  return (
    <>
      <Modal
        open={open}
        title={id ? "编辑客户" : "添加客户"}
        okText="确定"
        cancelText="取消"
        okButtonProps={{ htmlType: 'submit' }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            initialValues={{ modifier: 'public' }}
            clearOnDestroy
            onFinish={onFinish}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="id"
          label="id"
          hidden
        >
          <Input placeholder={'点击输入'} />
        </Form.Item>
        <Form.Item
          name="name"
          label="客户名称"
          rules={[{ required: true, message: '请输入客户名称' }]}
        >
          <Input placeholder={'请输入'} maxLength={20} />
        </Form.Item>
        <Form.Item name="wechat" label="微信/手机号" rules={[{ required: true, message: '请选择周期日期' }]}>
          <Input placeholder={'请输入'} maxLength={30} />
        </Form.Item>
        <Form.Item name="remark" label={'备注'}>
          <Input.TextArea placeholder={'请输入'} maxLength={100} />
        </Form.Item>
      </Modal>
    </>
  );
};

export default React.forwardRef(AddModal)
