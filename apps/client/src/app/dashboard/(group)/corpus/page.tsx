'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import {
  getCustomPackages,
  getPublicCustomPackages,
  createCustomPackage,
  deleteCustomPackage,
  importCustomPackageWords
} from '@/api';
import type { CustomPackage as ApiCustomPackage } from '@/request/globals';
import PageHeader from './components/PageHeader';
import PackageList from './components/PackageList';
import CreatePackageModal from './components/CreatePackageModal';
import ImportWordsModal from './components/ImportWordsModal';
import ErrorBoundary from '@/components/ErrorBoundary';

// 使用API类型定义
type CustomPackage = ApiCustomPackage;

export default function Corpus() {
  const [messageApi, contextHolder] = message.useMessage();

  // 状态管理
  const [packages, setPackages] = useState<CustomPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
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
  const handleImportWords = (id: string) => {
    setSelectedPackageId(id);
    setImportModalVisible(true);
  };

  // 处理单词导入
  const handleImportWordsData = async (wordsData: any[]) => {
    if (!selectedPackageId) {
      messageApi.error('请选择要导入的词库');
      return;
    }

    try {
      const batchSize = 100; // 每批最多导入100条
      const totalBatches = Math.ceil(wordsData.length / batchSize);
      let successCount = 0;
      let errorCount = 0;

      // 显示导入开始消息
      messageApi.loading({
        content: `开始导入 ${wordsData.length} 个单词，共 ${totalBatches} 批...`,
        duration: 0,
        key: 'import-progress'
      });

      // 分批导入
      for (let i = 0; i < totalBatches; i++) {
        const startIndex = i * batchSize;
        const endIndex = Math.min(startIndex + batchSize, wordsData.length);
        const batchData = wordsData.slice(startIndex, endIndex);

        try {
          const response = await importCustomPackageWords(selectedPackageId, {
            words: batchData
          });

          if (response && (response as any).code === 200) {
            successCount += batchData.length;
            messageApi.loading({
              content: `正在导入第 ${i + 1}/${totalBatches} 批，已成功导入 ${successCount} 个单词...`,
              duration: 0,
              key: 'import-progress'
            });
          } else {
            errorCount += batchData.length;
            console.error(
              `第 ${i + 1} 批导入失败:`,
              (response as any)?.message
            );
          }
        } catch (error) {
          errorCount += batchData.length;
          console.error(`第 ${i + 1} 批导入失败:`, error);
        }

        // 添加短暂延迟，避免请求过于频繁
        if (i < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // 关闭加载消息
      messageApi.destroy('import-progress');

      // 显示最终结果
      if (errorCount === 0) {
        messageApi.success(`成功导入 ${successCount} 个单词`);
      } else if (successCount === 0) {
        messageApi.error(`导入失败，${errorCount} 个单词未能导入`);
      } else {
        messageApi.warning(
          `导入完成：成功 ${successCount} 个，失败 ${errorCount} 个`
        );
      }

      // 关闭模态框并重置状态
      setImportModalVisible(false);
      setSelectedPackageId('');

      // 重新加载词库列表以更新数据
      loadPackages();
    } catch (error) {
      messageApi.destroy('import-progress');
      console.error('导入失败:', error);
      messageApi.error('导入失败，请重试');
    }
  };

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Corpus页面错误:', error, errorInfo);
        messageApi.error('页面出现错误，请刷新重试');
      }}>
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
            />
          </div>

          {/* 创建词库模态框 */}
          <CreatePackageModal
            visible={createModalVisible}
            onCancel={() => setCreateModalVisible(false)}
            onSubmit={handleCreatePackage}
          />

          {/* 导入单词模态框 */}
          <ImportWordsModal
            visible={importModalVisible}
            onCancel={() => {
              setImportModalVisible(false);
              setSelectedPackageId('');
            }}
            onImport={handleImportWordsData}
            packageId={selectedPackageId}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
