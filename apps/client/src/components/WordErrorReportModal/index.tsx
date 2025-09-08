'use client';
import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Spin } from 'antd';
import { Word } from '@/request/globals';

interface WordErrorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: Word | null;
  onSubmit: (wordId: string, errorDescription: string) => Promise<void>;
}

const WordErrorReportModal: React.FC<WordErrorReportModalProps> = ({
  isOpen,
  onClose,
  word,
  onSubmit
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { errorDescription: string }) => {
    if (!word) return;

    setLoading(true);
    try {
      await onSubmit(word.id, values.errorDescription);
      message.success('错误报告提交成功，感谢您的反馈！');
      form.resetFields();
      onClose();
    } catch (error) {
      message.error('提交失败，请稍后重试');
      console.error('Error submitting report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title='报告单词错误'
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      className='word-error-report-modal'
      styles={{
        content: {
          background:
            'linear-gradient(135deg, rgba(15, 20, 35, 0.95) 0%, rgba(25, 30, 50, 0.9) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow:
            '0 25px 20px -12px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.05)',
          borderRadius: '12px',
          backdropFilter: 'blur(20px)'
        },
        header: {
          backgroundColor: 'transparent',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '16px 20px',
          color: 'white'
        },
        body: {
          padding: '20px'
        }
      }}
    >
      <div className='text-gray-300'>
        {word && (
          <div className='mb-6 p-4 bg-slate-800 rounded-lg border border-gray-600'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-lg font-semibold text-white'>{word.word}</h3>
              <span className='text-sm text-gray-400'>
                {word.language?.name} - {word.category?.name}
              </span>
            </div>
            <div className='space-y-2'>
              <div>
                <span className='text-gray-400'>释义：</span>
                <span className='text-white'>{word.meaning}</span>
              </div>
              {word.usPhonetic && (
                <div>
                  <span className='text-gray-400'>美式音标：</span>
                  <span className='text-white'>{word.ukPhonetic}</span>
                </div>
              )}
              {word.ukPhonetic && (
                <div>
                  <span className='text-gray-400'>英式音标：</span>
                  <span className='text-white'>{word.ukPhonetic}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          className='word-error-report-form'
        >
          <Form.Item
            name='errorDescription'
            label={<span className='text-gray-300'>错误描述</span>}
            rules={[
              { required: true, message: '请描述您发现的错误' },
              { min: 5, message: '错误描述至少需要5个字符' },
              { max: 500, message: '错误描述不能超过500个字符' }
            ]}
          >
            <Input.TextArea
              rows={6}
              placeholder='请详细描述您发现的错误，例如：发音标注有误、释义不准确、拼写错误等...'
              style={{
                backgroundColor: '#334155',
                borderColor: '#4b5563',
                color: '#ffffff'
              }}
            />
          </Form.Item>

          <div className='flex justify-end space-x-3 mt-6'>
            <Button onClick={handleCancel}>取消</Button>
            <Button type='primary' htmlType='submit' loading={loading}>
              {loading ? <Spin size='small' /> : '提交报告'}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default WordErrorReportModal;
