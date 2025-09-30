'use client';
import React, { useMemo } from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface ImportSummaryProps {
  data: any[];
  fieldMapping: {
    word: string;
    meaning: string;
    usPhonetic?: string;
    ukPhonetic?: string;
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
      const meaning = row[fieldMapping.meaning];
      // 只有单词和翻译不能为空，其他字段可以为空
      return (
        word &&
        word.toString().trim() !== '' &&
        meaning &&
        meaning.toString().trim() !== ''
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
    </div>
  );
}
