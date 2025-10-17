'use client';
import React from 'react';
import { Button, Row, Col } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';

interface ActionButtonsProps {
  onSave: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export default function ActionButtons({
  onSave,
  onReset,
  isLoading
}: ActionButtonsProps) {
  return (
    <Row justify='center' gutter={24} className='mt-10'>
      <Col>
        <Button
          type='primary'
          icon={<SaveOutlined />}
          onClick={onSave}
          loading={isLoading}
          size='large'
          className='bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 border-0 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 h-12 px-8 text-lg font-medium'>
          保存设置
        </Button>
      </Col>
      <Col>
        <Button
          icon={<ReloadOutlined />}
          onClick={onReset}
          size='large'
          className='bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-white hover:text-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-8 text-lg font-medium'>
          重置默认
        </Button>
      </Col>
    </Row>
  );
}
