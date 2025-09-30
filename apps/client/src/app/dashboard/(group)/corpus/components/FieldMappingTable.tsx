'use client';
import React, { useState, useEffect } from 'react';
import { Table, Select, Typography, Card, Alert, Checkbox } from 'antd';
import { AlertTriangle, Table as TableIcon } from 'lucide-react';

const { Text } = Typography;
const { Option } = Select;

interface FieldMappingTableProps {
  headers: string[];
  onMapping: (mapping: any) => void;
  initialMapping?: any;
}

interface FieldMappingConfig {
  word: string;
  translation: string;
  pronunciation?: string;
}

const TARGET_FIELDS = [
  { key: 'word', label: '单词', required: true, description: '单词内容' },
  {
    key: 'translation',
    label: '翻译',
    required: true,
    description: '单词翻译'
  },
  {
    key: 'pronunciation',
    label: '音标',
    required: false,
    description: '音标'
  }
];

export default function FieldMappingTable({
  headers,
  onMapping,
  initialMapping
}: FieldMappingTableProps) {
  const [mapping, setMapping] = useState<FieldMappingConfig>(
    initialMapping || {
      word: '',
      translation: '',
      pronunciation: ''
    }
  );

  // 初始化表单值
  useEffect(() => {
    if (initialMapping) {
      setMapping(initialMapping);
    }
  }, [initialMapping]);

  // 处理字段映射变化
  const handleFieldChange = (field: string, value: string) => {
    const newMapping = { ...mapping, [field]: value };
    setMapping(newMapping);
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

  // 表格数据
  const tableData = TARGET_FIELDS.map(field => ({
    key: field.key,
    targetField: field.label,
    required: field.required,
    description: field.description,
    sourceField: mapping[field.key as keyof FieldMappingConfig] || '',
    fieldKey: field.key
  }));

  // 表格列配置
  const columns: any = [
    {
      title: '目标字段',
      dataIndex: 'targetField',
      key: 'targetField',
      align: 'center',
      render: (text: string, record: any) => (
        <div className='flex items-center justify-center space-x-2'>
          <Text className='font-medium text-white relative'>
            {record.required && (
              <Text className='!text-red-500 text-xs'> * </Text>
            )}
            {text}
          </Text>
        </div>
      )
    },
    {
      title: '源字段',
      dataIndex: 'sourceField',
      key: 'sourceField',
      align: 'center',
      render: (text: string, record: any) => {
        const hasConflict = hasFieldConflict() && text;
        return (
          <Select
            value={text}
            onChange={value => handleFieldChange(record.fieldKey, value)}
            placeholder='选择源字段'
            className='w-full'
            status={hasConflict ? 'error' : undefined}
            size='small'>
            <Option value=''>
              <Text className='text-gray-500'>不选择</Text>
            </Option>
            {headers.map(header => (
              <Option
                key={header}
                value={header}
                disabled={
                  getSelectedFields().includes(header) &&
                  mapping[record.fieldKey as keyof FieldMappingConfig] !==
                    header
                }>
                {header}
              </Option>
            ))}
          </Select>
        );
      }
    },
    {
      title: '主键',
      dataIndex: 'primaryKey',
      key: 'primaryKey',
      align: 'center',
      render: (text: string, record: any) => (
        <div className='flex justify-center'>
          <Checkbox checked={record.fieldKey === 'word'} disabled={true} />
        </div>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <Text className='text-gray-400 text-sm'>{text}</Text>
      )
    }
  ];

  return (
    <div className='space-y-6'>
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

      {/* 字段映射表格 */}
      <Card>
        <div className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <TableIcon className='w-4 h-4 text-blue-400' />
            <Text className='text-white font-semibold text-lg'>字段映射表</Text>
          </div>

          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            size='small'
            className='field-mapping-table'
            rowClassName={record =>
              record.required
                ? 'bg-gradient-to-r from-red-500/5 to-red-500/50 border-l-4 border-red-500/50'
                : 'bg-slate-700/20 hover:bg-slate-700/30 transition-colors duration-200'
            }
            scroll={{ x: 600 }}
          />
        </div>
      </Card>
    </div>
  );
}
