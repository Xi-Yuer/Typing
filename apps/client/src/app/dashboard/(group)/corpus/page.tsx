'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import {
  getCustomPackages,
  getPublicCustomPackages,
  createCustomPackage,
  deleteCustomPackage
} from '@/api';
import type { CustomPackage as ApiCustomPackage } from '@/request/globals';
import PageHeader from './components/PageHeader';
import PackageList from './components/PackageList';
import CreatePackageModal from './components/CreatePackageModal';

// 使用API类型定义
type CustomPackage = ApiCustomPackage;

export default function Corpus() {
  const [messageApi, contextHolder] = message.useMessage();

  // 状态管理
  const [packages, setPackages] = useState<CustomPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [packageType, setPackageType] = useState<'my' | 'public'>('my');

  // 加载自定义词库列表
  const loadPackages = useCallback(async () => {
    try {
      setLoading(true);
      const response =
        packageType === 'my'
          ? await getCustomPackages()
          : await getPublicCustomPackages();
      if (response && response.code === 200) {
        setPackages(response.data.list);
      } else {
        messageApi.error((response as any)?.message || '加载词库失败');
      }
    } catch {
      messageApi.error('加载词库失败');
    } finally {
      setLoading(false);
    }
  }, [messageApi, packageType]);

  // 初始化加载
  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  // 创建词库
  const handleCreatePackage = async (values: any) => {
    try {
      const response = await createCustomPackage(values);
      if (response && (response as any).code === 200) {
        messageApi.success('创建词库成功');
        setCreateModalVisible(false);
        loadPackages();
      } else {
        messageApi.error((response as any)?.message || '创建词库失败');
      }
    } catch {
      messageApi.error('创建词库失败');
    }
  };

  // 删除词库
  const handleDeletePackage = async (id: string) => {
    try {
      const response = await deleteCustomPackage(id);
      if (response && (response as any).code === 200) {
        messageApi.success('删除词库成功');
        loadPackages();
      } else {
        messageApi.error((response as any)?.message || '删除词库失败');
      }
    } catch {
      messageApi.error('删除词库失败');
    }
  };

  // 切换词库类型
  const handlePackageTypeChange = (value: 'my' | 'public') => {
    setPackageType(value);
  };

  // 导入单词
  const handleImportWords = (_id: string) => {
    // TODO: 实现导入单词功能
    messageApi.info('导入单词功能待实现');
  };

  // 开始练习
  const handleStartPractice = (_id: string) => {
    // TODO: 实现开始练习功能
    messageApi.info('开始练习功能待实现');
  };

  return (
    <div className='p-6'>
      {contextHolder}
      <div className='max-w-7xl mx-auto'>
        {/* 页面头部 */}
        <PageHeader
          packageType={packageType}
          onPackageTypeChange={handlePackageTypeChange}
          onCreatePackage={() => setCreateModalVisible(true)}
        />

        {/* 词库卡片列表 */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <PackageList
            packages={packages}
            loading={loading}
            packageType={packageType}
            onDelete={handleDeletePackage}
            onImport={handleImportWords}
            onStartPractice={handleStartPractice}
          />
        </div>

        {/* 创建词库模态框 */}
        <CreatePackageModal
          visible={createModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          onSubmit={handleCreatePackage}
        />
      </div>
    </div>
  );
}
