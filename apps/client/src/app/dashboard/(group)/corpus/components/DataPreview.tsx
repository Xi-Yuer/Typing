'use client';
import React, { useMemo } from 'react';
import { Table, Card, Typography, Tag, Statistic, Row, Col } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface DataPreviewProps {
  data: any[];
  fieldMapping: {
    word: string;
    translation: string;
    pronunciation?: string;
    difficulty?: string;
    category?: string;
  };
}

export default function DataPreview({ data, fieldMapping }: DataPreviewProps) {
  // 计算统计数据
  const stats = useMemo(() => {
    const total = data.length;
    const valid = data.filter(
      row => row[fieldMapping.word] && row[fieldMapping.translation]
    ).length;
    const invalid = total - valid;

    return { total, valid, invalid };
  }, [data, fieldMapping]);

  // 准备表格数据
  const tableData = useMemo(() => {
    return data.slice(0, 10).map((row, index) => ({
      key: index,
      word: row[fieldMapping.word] || '',
      translation: row[fieldMapping.translation] || '',
      pronunciation: fieldMapping.pronunciation
        ? row[fieldMapping.pronunciation]
        : '',
      difficulty: fieldMapping.difficulty ? row[fieldMapping.difficulty] : '',
      category: fieldMapping.category ? row[fieldMapping.category] : '',
      isValid: !!(row[fieldMapping.word] && row[fieldMapping.translation])
    }));
  }, [data, fieldMapping]);

  // 表格列配置
  const columns = [
    {
      title: '状态',
      dataIndex: 'isValid',
      key: 'isValid',
      width: 80,
      render: (isValid: boolean) => (
        <div className='flex justify-center'>
          {isValid ? (
            <CheckCircleOutlined className='text-green-400 text-lg' />
          ) : (
            <ExclamationCircleOutlined className='text-red-400 text-lg' />
          )}
        </div>
      )
    },
    {
      title: '单词',
      dataIndex: 'word',
      key: 'word',
      render: (text: string, record: any) => (
        <Text className={record.isValid ? 'text-white' : 'text-red-400'}>
          {text || '空'}
        </Text>
      )
    },
    {
      title: '翻译',
      dataIndex: 'translation',
      key: 'translation',
      render: (text: string, record: any) => (
        <Text className={record.isValid ? 'text-white' : 'text-red-400'}>
          {text || '空'}
        </Text>
      )
    },
    ...(fieldMapping.pronunciation
      ? [
          {
            title: '发音',
            dataIndex: 'pronunciation',
            key: 'pronunciation',
            render: (text: string) => (
              <Text className='text-gray-300'>{text || '-'}</Text>
            )
          }
        ]
      : []),
    ...(fieldMapping.difficulty
      ? [
          {
            title: '难度',
            dataIndex: 'difficulty',
            key: 'difficulty',
            render: (text: string) => {
              const getDifficultyColor = (difficulty: string) => {
                switch (difficulty?.toLowerCase()) {
                  case 'easy':
                    return 'green';
                  case 'medium':
                    return 'orange';
                  case 'hard':
                    return 'red';
                  default:
                    return 'default';
                }
              };

              return (
                <Tag color={getDifficultyColor(text)}>{text || 'medium'}</Tag>
              );
            }
          }
        ]
      : []),
    ...(fieldMapping.category
      ? [
          {
            title: '分类',
            dataIndex: 'category',
            key: 'category',
            render: (text: string) => (
              <Tag color='blue'>{text || 'default'}</Tag>
            )
          }
        ]
      : [])
  ];

  return (
    <div className='space-y-6'>
      {/* 统计信息 */}
      <Row gutter={16}>
        <Col span={8}>
          <Card className='bg-slate-800/50 border-slate-700/50 text-center'>
            <Statistic
              title='总数据'
              value={stats.total}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className='bg-slate-800/50 border-slate-700/50 text-center'>
            <Statistic
              title='有效数据'
              value={stats.valid}
              valueStyle={{ color: '#10b981' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className='bg-slate-800/50 border-slate-700/50 text-center'>
            <Statistic
              title='无效数据'
              value={stats.invalid}
              valueStyle={{ color: '#ef4444' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 数据预览 */}
      <Card className='bg-slate-800/50 border-slate-700/50'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <InfoCircleOutlined className='text-blue-400' />
              <Text className='text-blue-300 font-medium'>数据预览</Text>
            </div>
            <Text className='text-gray-400 text-sm'>显示前 10 条数据</Text>
          </div>

          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            size='small'
            scroll={{ x: 600 }}
            className='data-preview-table'
          />

          {stats.invalid > 0 && (
            <div className='bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4'>
              <div className='flex items-start space-x-3'>
                <ExclamationCircleOutlined className='text-yellow-400 text-lg mt-1' />
                <div>
                  <Text className='text-yellow-300 font-medium block'>
                    发现无效数据
                  </Text>
                  <Paragraph className='text-sm text-gray-300 mb-0'>
                    有 {stats.invalid}{' '}
                    条数据缺少必填字段（单词或翻译），这些数据将被跳过。
                  </Paragraph>
                </div>
              </div>
            </div>
          )}

          {stats.valid === 0 && (
            <div className='bg-red-500/10 border border-red-500/30 rounded-lg p-4'>
              <div className='flex items-start space-x-3'>
                <ExclamationCircleOutlined className='text-red-400 text-lg mt-1' />
                <div>
                  <Text className='text-red-300 font-medium block'>
                    没有有效数据
                  </Text>
                  <Paragraph className='text-sm text-gray-300 mb-0'>
                    所有数据都缺少必填字段，无法导入。请检查字段映射或数据格式。
                  </Paragraph>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 导入说明 */}
      <Card className='bg-green-500/10 border-green-500/30'>
        <div className='flex items-start space-x-3'>
          <CheckCircleOutlined className='text-green-400 text-lg mt-1' />
          <div>
            <Text className='text-green-300 font-medium block'>准备导入</Text>
            <Paragraph className='text-sm text-gray-300 mb-0'>
              确认无误后，点击"确认导入"按钮将 {stats.valid}{' '}
              条有效数据导入到词库中。
            </Paragraph>
          </div>
        </div>
      </Card>
    </div>
  );
}
