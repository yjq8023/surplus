import React, { useState, useImperativeHandle } from 'react'
import { Modal, Form, Input, Radio, DatePicker } from 'antd'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

const AddModal = (props: any, ref: any) => {
  const { onCreate } = props
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const id = Form.useWatch('id', form)

  useImperativeHandle(ref, () => ({
    open: (d = {}) => {
      setOpen(true)
      setTimeout(() => {
        console.log(d);

        form.setFieldsValue(d)
      }, 300)
    },
    close: () => setOpen(false),
  }))
  return (
    <>
      <Modal
        open={open}
        title={id ? "编辑周期" : "新建周期"}
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
            onFinish={async (values) => {
              await onCreate(values)
              setOpen(false)
            }}
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
          label="周期名称"
          rules={[{ required: true, message: '请输入周期名称' }]}
        >
          <Input placeholder={'点击输入'} />
        </Form.Item>
        <Form.Item name="date" label="日期" rules={[{ required: true, message: '请选择周期日期' }]}>
          <DatePicker style={{ width: '100%' }} placeholder={'点击选择'} />
        </Form.Item>
        <Form.Item name="type" label={'类型'} rules={[{ required: true, message: '请选择类型' }]}>
          <Radio.Group>
            <Radio value="fc">福彩</Radio>
            <Radio value="tc">体彩</Radio>
          </Radio.Group>
        </Form.Item>
      </Modal>
    </>
  );
};

export default React.forwardRef(AddModal)
