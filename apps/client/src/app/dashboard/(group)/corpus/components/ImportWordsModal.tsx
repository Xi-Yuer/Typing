'use client';
import React, { useState, useCallback } from 'react';
import { Modal, Button, message, Space } from 'antd';
import { ChevronLeft, ChevronRight, X, Database } from 'lucide-react';
import * as XLSX from 'xlsx';
import WizardHeader from './WizardHeader';
import FileUpload from './FileUpload';
import FieldMappingTable from './FieldMappingTable';
import ImportSummary from './ImportSummary';

interface ImportWordsModalProps {
  visible: boolean;
  onCancel: () => void;
  onImport: (data: any[]) => void;
  packageId: string;
}

interface ExcelData {
  [key: string]: any;
}

interface FieldMappingConfig {
  word: string;
  meaning: string;
  usPhonetic?: string;
  ukPhonetic?: string;
  difficulty?: string;
  category?: string;
}

export default function ImportWordsModal({
  visible,
  onCancel,
  onImport,
  packageId
}: ImportWordsModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [excelData, setExcelData] = useState<ExcelData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<FieldMappingConfig>({
    word: '',
    meaning: '',
    usPhonetic: '',
    ukPhonetic: '',
    difficulty: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  // 重置状态
  const resetState = useCallback(() => {
    setCurrentStep(0);
    setExcelData([]);
    setHeaders([]);
    setFieldMapping({
      word: '',
      meaning: '',
      usPhonetic: '',
      ukPhonetic: '',
      difficulty: '',
      category: ''
    });
    setLoading(false);
    setImporting(false);
  }, []);

  // 处理文件上传
  const handleFileUpload = useCallback((file: File) => {
    setLoading(true);

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, {
          type: 'array',
          codepage: 65001 // UTF-8 编码，解决中文乱码问题
        });

        // 获取第一个工作表
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // 转换为 JSON 数据
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length === 0) {
          setLoading(false);
          return;
        }

        // 第一行作为表头
        const headers = jsonData[0] as string[];
        const dataRows = jsonData.slice(1) as any[][];

        // 转换为对象数组
        const formattedData = dataRows.map(row => {
          const obj: ExcelData = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });

        setHeaders(headers);
        setExcelData(formattedData);
        setCurrentStep(1);
        message.success(`成功解析 ${formattedData.length} 条数据`);
      } catch (error) {
        console.error('解析 Excel 文件失败:', error);
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  }, []);

  // 处理字段映射
  const handleFieldMapping = useCallback((mapping: FieldMappingConfig) => {
    setFieldMapping(mapping);
  }, []);

  // 处理数据导入
  const handleImport = useCallback(async () => {
    if (!fieldMapping.word || !fieldMapping.meaning) {
      message.error('请至少映射单词和翻译字段');
      return;
    }

    setImporting(true);

    try {
      // 转换数据格式
      const importData = excelData
        .map(row => ({
          word: row[fieldMapping.word] || '',
          meaning: row[fieldMapping.meaning] || '',
          usPhonetic: fieldMapping.usPhonetic
            ? row[fieldMapping.usPhonetic]
            : undefined,
          ukPhonetic: fieldMapping.ukPhonetic
            ? row[fieldMapping.ukPhonetic]
            : undefined,
          difficulty: fieldMapping.difficulty
            ? row[fieldMapping.difficulty]
            : undefined,
          category: fieldMapping.category
            ? row[fieldMapping.category]
            : undefined,
          packageId
        }))
        .filter(item => {
          // 只有单词和释义不能为空，其他字段可以为空
          return (
            item.word &&
            item.word.toString().trim() !== '' &&
            item.meaning &&
            item.meaning.toString().trim() !== ''
          );
        });

      // 调用导入接口
      await onImport(importData);

      message.success(`成功导入 ${importData.length} 个单词`);
      resetState();
      onCancel();
    } catch (error) {
      console.error('导入失败:', error);
      message.error('导入失败，请重试');
    } finally {
      setImporting(false);
    }
  }, [excelData, fieldMapping, packageId, onImport, onCancel, resetState]);

  // 处理取消
  const handleCancel = useCallback(() => {
    if (importing) {
      message.warning('正在导入中，请稍候...');
      return;
    }
    resetState();
    onCancel();
  }, [resetState, onCancel, importing]);

  // 上一步
  const handlePrev = useCallback(() => {
    if (importing) {
      message.warning('正在导入中，请稍候...');
      return;
    }
    setCurrentStep(currentStep - 1);
  }, [currentStep, importing]);

  // 下一步
  const handleNext = useCallback(() => {
    if (importing) {
      message.warning('正在导入中，请稍候...');
      return;
    }
    setCurrentStep(currentStep + 1);
  }, [currentStep, importing]);

  // 获取步骤标题
  const getStepTitle = () => {
    if (importing) {
      return '正在导入数据...';
    }
    switch (currentStep) {
      case 0:
        return '选择数据源';
      case 1:
        return '字段映射';
      case 2:
        return '导入摘要';
      default:
        return '';
    }
  };

  // 获取步骤描述
  const getStepDescription = () => {
    if (importing) {
      return '正在处理数据，请勿关闭页面或离开当前页面...';
    }
    switch (currentStep) {
      case 0:
        return '选择要导入的 Excel 文件';
      case 1:
        return '定义字段映射，设置源字段和目标字段之间的对应关系';
      case 2:
        return '确认导入设置并开始导入';
      default:
        return '';
    }
  };

  // 渲染步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <FileUpload onFileUpload={handleFileUpload} loading={loading} />;
      case 1:
        return (
          <FieldMappingTable
            headers={headers}
            onMapping={handleFieldMapping}
            initialMapping={fieldMapping}
          />
        );
      case 2:
        return <ImportSummary data={excelData} fieldMapping={fieldMapping} />;
      default:
        return null;
    }
  };

  // 渲染步骤按钮
  const renderStepButtons = () => {
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === 2;

    return (
      <div className='flex justify-between items-center pt-6 border-t border-slate-700/50'>
        <Button
          onClick={handleCancel}
          size='large'
          className='px-6 py-2 h-auto text-gray-300 hover:text-white border-slate-600 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-700/50'
          icon={<X className='w-4 h-4' />}>
          取消
        </Button>
        <Space size='middle'>
          {!isFirstStep && (
            <Button
              onClick={handlePrev}
              size='large'
              className='px-6 py-2 h-auto text-gray-300 hover:text-white border-slate-600 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-700/50'
              icon={<ChevronLeft className='w-4 h-4' />}>
              上一步
            </Button>
          )}
          {!isLastStep ? (
            <Button
              type='primary'
              onClick={handleNext}
              size='large'
              disabled={
                currentStep === 1 &&
                (!fieldMapping.word || !fieldMapping.meaning)
              }
              className='px-6 py-2 h-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed'
              icon={<ChevronRight className='w-4 h-4' />}>
              下一步
            </Button>
          ) : (
            <Button
              type='primary'
              onClick={handleImport}
              loading={importing}
              size='large'
              disabled={importing}
              className='px-6 py-2 h-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed'
              icon={<Database className='w-4 h-4' />}>
              {importing ? '正在导入中...' : '开始导入'}
            </Button>
          )}
        </Space>
      </div>
    );
  };

  return (
    <Modal
      title={
        <div className='flex items-center space-x-3'>
          <div className='w-8 h-8 rounded-full bg-gradient-to-r from-blue-500/20 to-orange-500/20 flex items-center justify-center'>
            <Database className='w-4 h-4 text-blue-400' />
          </div>
          <span className='text-white font-semibold text-lg'>数据导入向导</span>
        </div>
      }
      open={visible}
      onCancel={importing ? undefined : handleCancel}
      closable={!importing}
      maskClosable={!importing}
      footer={renderStepButtons()}
      width={1000}
      styles={{
        content: {
          background:
            'linear-gradient(135deg, rgba(15, 20, 35, 0.98) 0%, rgba(25, 30, 50, 0.95) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '16px',
          backdropFilter: 'blur(25px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        },
        header: {
          backgroundColor: 'transparent',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px 24px',
          color: 'white'
        },
        body: {
          padding: '24px'
        },
        mask: {
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }
      }}>
      <div className='space-y-8'>
        {/* 向导头部 */}
        <WizardHeader
          currentStep={currentStep}
          totalSteps={3}
          title={getStepTitle()}
          description={getStepDescription()}
        />

        {/* 步骤内容 */}
        <div>{renderStepContent()}</div>
      </div>
    </Modal>
  );
}
