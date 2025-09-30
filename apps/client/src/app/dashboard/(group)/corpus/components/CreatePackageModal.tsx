'use client';
import React from 'react';
import { Modal, Input, Button, Space, Form, Switch } from 'antd';

const { TextArea } = Input;

interface CreatePackageModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
}

export default function CreatePackageModal({
  visible,
  onCancel,
  onSubmit,
  loading = false
}: CreatePackageModalProps) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = async (values: any) => {
    await onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title='创建自定义词库'
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      styles={{
        content: {
          background:
            'linear-gradient(135deg, rgba(15, 20, 35, 0.95) 0%, rgba(25, 30, 50, 0.9) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '12px',
          backdropFilter: 'blur(25px)'
        },
        header: {
          backgroundColor: 'transparent',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '16px 20px',
          color: 'white'
        },
        body: {
          padding: '20px'
        },
        mask: {
          backdropFilter: 'blur(8px)'
        }
      }}>
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        className='mt-4'>
        <Form.Item
          name='name'
          label='词库名称'
          rules={[{ required: true, message: '请输入词库名称' }]}>
          <Input placeholder='请输入词库名称' />
        </Form.Item>

        <Form.Item name='description' label='词库描述'>
          <TextArea placeholder='请输入词库描述（可选）' rows={3} />
        </Form.Item>

        <Form.Item
          name='isPublic'
          label='是否公开'
          valuePropName='checked'
          initialValue={true}>
          <Switch checkedChildren='公开' unCheckedChildren='私有' />
        </Form.Item>

        <Form.Item className='mb-0 text-right'>
          <Space>
            <Button onClick={handleCancel} disabled={loading}>
              取消
            </Button>
            <Button type='primary' htmlType='submit' loading={loading}>
              创建
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
