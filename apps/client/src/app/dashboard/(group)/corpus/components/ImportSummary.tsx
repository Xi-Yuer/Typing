'use client';
import React, { useMemo } from 'react';
import { Card, Typography, Statistic, Row, Col } from 'antd';
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  Database,
  TrendingUp,
  Info
} from 'lucide-react';

const { Text, Paragraph } = Typography;

interface ImportSummaryProps {
  data: any[];
  fieldMapping: {
    word: string;
    translation: string;
    pronunciation?: string;
    difficulty?: string;
    category?: string;
  };
}

export default function ImportSummary({
  data,
  fieldMapping
}: ImportSummaryProps) {
  // 计算统计数据
  const stats = useMemo(() => {
    const total = data.length;
    const valid = data.filter(row => {
      const word = row[fieldMapping.word];
      const translation = row[fieldMapping.translation];
      // 只有单词和翻译不能为空，其他字段可以为空
      return (
        word &&
        word.toString().trim() !== '' &&
        translation &&
        translation.toString().trim() !== ''
      );
    }).length;
    const invalid = total - valid;

    return { total, valid, invalid };
  }, [data, fieldMapping]);

  return (
    <div className='space-y-6 text-white flex flex-col gap-4'>
      {/* 统计信息 */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card className='text-center bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300'>
            <div className='flex flex-col items-center space-y-3'>
              <div className='w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center'>
                <FileText className='w-6 h-6 text-blue-400' />
              </div>
              <Statistic
                title={<span className='text-gray-300 text-sm'>总数据</span>}
                value={stats.total}
                valueStyle={{
                  color: '#3b82f6',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className='text-center bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300'>
            <div className='flex flex-col items-center space-y-3'>
              <div className='w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center'>
                <CheckCircle2 className='w-6 h-6 text-green-400' />
              </div>
              <Statistic
                title={<span className='text-gray-300 text-sm'>有效数据</span>}
                value={stats.valid}
                valueStyle={{
                  color: '#10b981',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className='text-center bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm hover:border-red-500/30 transition-all duration-300'>
            <div className='flex flex-col items-center space-y-3'>
              <div className='w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center'>
                <AlertTriangle className='w-6 h-6 text-red-400' />
              </div>
              <Statistic
                title={<span className='text-gray-300 text-sm'>无效数据</span>}
                value={stats.invalid}
                valueStyle={{
                  color: '#ef4444',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 数据质量分析 */}
      {stats.total > 0 && (
        <Card className=''>
          <div className='flex items-start space-x-4'>
            <div className='flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center'>
              <TrendingUp className='w-4 h-4 text-purple-400' />
            </div>
            <div className='space-y-2'>
              <Text className='text-purple-300 font-semibold text-base block'>
                数据质量分析
              </Text>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Text className='text-sm text-gray-300'>数据有效率</Text>
                  <Text className='text-sm font-medium text-white'>
                    {((stats.valid / stats.total) * 100).toFixed(1)}%
                  </Text>
                </div>
                <div className='w-full bg-slate-700/50 rounded-full h-2'>
                  <div
                    className='bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500'
                    style={{ width: `${(stats.valid / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 导入说明 */}
      <Card className=''>
        <div className='flex items-start space-x-4'>
          <div className='flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center'>
            <Database className='w-4 h-4 text-green-400' />
          </div>
          <div className='space-y-2'>
            <Text className='text-green-300 font-semibold text-base block'>
              准备导入
            </Text>
            <Paragraph className='text-sm text-gray-300 mb-0 leading-relaxed'>
              确认无误后，点击"开始导入"按钮将{' '}
              <span className='text-green-400 font-semibold'>
                {stats.valid}
              </span>{' '}
              条有效数据导入到词库中。
              {stats.invalid > 0 && (
                <span className='block mt-2 text-yellow-300'>
                  <Info className='w-4 h-4 inline mr-1' />有 {stats.invalid}{' '}
                  条数据因缺少必填字段将被跳过
                </span>
              )}
            </Paragraph>
          </div>
        </div>
      </Card>
    </div>
  );
}
