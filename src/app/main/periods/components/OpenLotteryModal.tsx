import React, { useState, useImperativeHandle } from 'react'
import { Modal, Form, Input, Radio, DatePicker } from 'antd'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { openLottery } from '@/services/periods';
dayjs.locale('zh-cn');

const OpenLotteryModal = (props: any, ref: any) => {
  const { onCreate } = props
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: (d = {}) => {
      setOpen(true)
      setTimeout(() => {
        form.setFieldsValue(d)
      }, 300)
    },
    close: () => setOpen(false),
  }))

  const onSubmit = (formData: any) => {
    openLottery(formData).then(() => {
      setOpen(false)
    })
  }
  return (
    <Modal
      open={open}
      title={"设置开奖号码"}
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
          initialValues={{}}
          clearOnDestroy
          onFinish={onSubmit}
        >
          {dom}
        </Form>
      )}
    >
      <Form.Item
        name="id"
        hidden
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="lotteryNumber"
        label="开奖号码"
        rules={[{ required: true, message: '请输入开奖号码' }]}
        extra="开奖后，周期将被锁单，无法继续添加新的订单"
      >
        <Input.OTP length={3} size='large' />
      </Form.Item>
    </Modal >
  );
};

export default React.forwardRef(OpenLotteryModal)
