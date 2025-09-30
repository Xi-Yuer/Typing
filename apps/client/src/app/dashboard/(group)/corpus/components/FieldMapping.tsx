'use client';
import React, { useState, useEffect } from 'react';
import { Select, Form, Card, Typography, Space, Alert } from 'antd';
import { Link, Info, AlertTriangle, ArrowRight } from 'lucide-react';

const { Text, Paragraph } = Typography;
const { Option } = Select;

interface FieldMappingProps {
  headers: string[];
  onMapping: (mapping: any) => void;
  initialMapping?: any;
}

interface FieldMappingConfig {
  word: string;
  translation: string;
  pronunciation?: string;
  difficulty?: string;
  category?: string;
}

const REQUIRED_FIELDS = [
  {
    key: 'word',
    label: '单词',
    required: true,
    description: '单词内容，必填字段'
  },
  {
    key: 'translation',
    label: '翻译',
    required: true,
    description: '单词翻译，必填字段'
  }
];

const OPTIONAL_FIELDS = [
  {
    key: 'pronunciation',
    label: '发音',
    required: false,
    description: '音标或发音标记'
  },
  {
    key: 'difficulty',
    label: '难度',
    required: false,
    description: '单词难度等级'
  },
  {
    key: 'category',
    label: '分类',
    required: false,
    description: '单词分类标签'
  }
];

export default function FieldMapping({
  headers,
  onMapping,
  initialMapping
}: FieldMappingProps) {
  const [form] = Form.useForm();
  const [mapping, setMapping] = useState<FieldMappingConfig>(
    initialMapping || {
      word: '',
      translation: '',
      pronunciation: '',
      difficulty: '',
      category: ''
    }
  );

  // 初始化表单值
  useEffect(() => {
    if (initialMapping) {
      form.setFieldsValue(initialMapping);
      setMapping(initialMapping);
    }
  }, [initialMapping, form]);

  // 处理字段映射变化
  const handleFieldChange = (field: string, value: string) => {
    const newMapping = { ...mapping, [field]: value };
    setMapping(newMapping);
    form.setFieldsValue(newMapping);
    onMapping(newMapping);
  };

  // 获取已选择的字段
  const getSelectedFields = () => {
    return Object.values(mapping).filter(value => value !== '');
  };

  // 检查字段冲突
  const hasFieldConflict = () => {
    const selectedFields = getSelectedFields();
    return selectedFields.length !== new Set(selectedFields).size;
  };

  // 渲染字段选择器
  const renderFieldSelector = (field: any) => {
    const isRequired = field.required;
    const hasConflict =
      hasFieldConflict() && mapping[field.key as keyof FieldMappingConfig];

    return (
      <Form.Item
        key={field.key}
        label={
          <Space>
            <Text className={isRequired ? 'text-red-400' : 'text-gray-300'}>
              {field.label}
              {isRequired && <span className='text-red-400 ml-1'>*</span>}
            </Text>
            {hasConflict && (
              <Text className='text-red-400 text-xs'>字段冲突</Text>
            )}
          </Space>
        }
        name={field.key}
        rules={[
          {
            required: isRequired,
            message: `请选择${field.label}字段`
          }
        ]}
        help={field.description}>
        <Select
          placeholder={`选择${field.label}字段`}
          value={mapping[field.key as keyof FieldMappingConfig]}
          onChange={value => handleFieldChange(field.key, value)}
          className='w-full'
          status={hasConflict ? 'error' : undefined}>
          <Option value=''>
            <Text className='text-gray-400'>不选择</Text>
          </Option>
          {headers.map(header => (
            <Option
              key={header}
              value={header}
              disabled={
                getSelectedFields().includes(header) &&
                mapping[field.key as keyof FieldMappingConfig] !== header
              }>
              {header}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  };

  return (
    <div className='space-y-6'>
      {/* 说明信息 */}
      <Card className='bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/30 backdrop-blur-sm'>
        <div className='flex items-start space-x-4'>
          <div className='flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center'>
            <Link className='w-4 h-4 text-blue-400' />
          </div>
          <div className='space-y-2'>
            <Text className='text-blue-300 font-semibold text-base block'>
              字段映射
            </Text>
            <Paragraph className='text-sm text-gray-300 mb-0 leading-relaxed'>
              请将 Excel 文件中的列与系统字段进行匹配。带{' '}
              <span className='text-red-400 font-medium'>*</span>{' '}
              的字段为必填项。
            </Paragraph>
          </div>
        </div>
      </Card>

      {/* 冲突提示 */}
      {hasFieldConflict() && (
        <Alert
          message='字段映射冲突'
          description='存在重复的字段映射，请检查并修改。'
          type='warning'
          showIcon
          className='mb-4 border-orange-500/30 bg-orange-500/10'
          icon={<AlertTriangle className='w-4 h-4' />}
        />
      )}

      {/* 字段映射表单 */}
      <Card className='bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm'>
        <Form form={form} layout='vertical' className='space-y-6'>
          {/* 必填字段 */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-3 mb-6 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20'>
              <div className='w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center'>
                <Info className='w-3 h-3 text-yellow-400' />
              </div>
              <Text className='text-yellow-300 font-semibold'>必填字段</Text>
              <div className='flex-1 h-px bg-yellow-500/20'></div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {REQUIRED_FIELDS.map(renderFieldSelector)}
            </div>
          </div>

          {/* 分隔线 */}
          <div className='flex items-center space-x-4 my-6'>
            <div className='flex-1 h-px bg-slate-600/50'></div>
            <ArrowRight className='w-4 h-4 text-slate-400' />
            <div className='flex-1 h-px bg-slate-600/50'></div>
          </div>

          {/* 可选字段 */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-3 mb-6 p-3 bg-green-500/10 rounded-lg border border-green-500/20'>
              <div className='w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center'>
                <Info className='w-3 h-3 text-green-400' />
              </div>
              <Text className='text-green-300 font-semibold'>可选字段</Text>
              <div className='flex-1 h-px bg-green-500/20'></div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {OPTIONAL_FIELDS.map(renderFieldSelector)}
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
}
