'use client';
import React from 'react';
import { Button, Space, Segmented } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface PageHeaderProps {
  packageType: 'my' | 'public';
  onPackageTypeChange: (value: 'my' | 'public') => void;
  onCreatePackage: () => void;
}

export default function PageHeader({
  packageType,
  onPackageTypeChange,
  onCreatePackage
}: PageHeaderProps) {
  return (
    <div className='mb-6 flex justify-between items-center'>
      <h2 className='text-2xl font-bold text-white'>我的词库</h2>
      <Space>
        <Segmented
          value={packageType}
          onChange={onPackageTypeChange}
          options={[
            { label: '我的词库', value: 'my' },
            { label: '公开词库', value: 'public' }
          ]}
          className='custom-segmented bg-slate-800/50 border border-slate-600'
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgb(71, 85, 105)',
            borderRadius: '8px',
            padding: '5px',
            textAlign: 'center'
          }}
        />
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={onCreatePackage}
          className='bg-green-600 hover:bg-green-700 border-green-600'>
          创建词库
        </Button>
      </Space>
    </div>
  );
}
