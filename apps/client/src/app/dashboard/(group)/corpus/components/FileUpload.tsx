'use client';
import React, { useCallback } from 'react';
import { Upload, Button, Typography, Card } from 'antd';
import { Upload as UploadIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import type { UploadProps } from 'antd';

const { Paragraph } = Typography;

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  loading?: boolean;
}

export default function FileUpload({
  onFileUpload,
  loading = false
}: FileUploadProps) {
  const handleUpload: UploadProps['customRequest'] = useCallback(
    ({ file }: any) => {
      const uploadFile = file as File;

      // 检查文件类型
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv' // .csv
      ];

      if (!allowedTypes.includes(uploadFile.type)) {
        return;
      }

      // 检查文件大小 (限制为 100MB)
      const maxSize = 100 * 1024 * 1024;
      if (uploadFile.size > maxSize) {
        return;
      }

      onFileUpload(uploadFile);
    },
    [onFileUpload]
  );

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx,.xls,.csv',
    customRequest: handleUpload,
    showUploadList: false,
    disabled: loading
  };

  return (
    <div className='space-y-6'>
      {/* 上传区域 */}
      <Card className='bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300'>
        <div className='text-center'>
          <Paragraph className='text-gray-300 mb-8 max-w-md mx-auto leading-relaxed'></Paragraph>
          <div className='space-y-3'>
            <div className='text-sm text-gray-300 space-y-2'>
              <div className='flex items-center space-x-2'>
                <CheckCircle2 className='w-4 h-4 text-green-400 flex-shrink-0' />
                <span>
                  支持 Excel (.xlsx, .xls) 和 CSV 格式文件，文件大小不超过 100MB
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle2 className='w-4 h-4 text-green-400 flex-shrink-0' />
                <span>第一行必须是表头，包含字段名称</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle2 className='w-4 h-4 text-green-400 flex-shrink-0' />
                <span>支持多列数据，如：单词、翻译、发音、难度等</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle2 className='w-4 h-4 text-green-400 flex-shrink-0' />
                <span>空行和空列会被自动忽略</span>
              </div>
              <div className='flex items-center space-x-2'>
                <AlertCircle className='w-4 h-4 text-yellow-400 flex-shrink-0' />
                <span>建议使用 UTF-8 编码保存文件</span>
              </div>
            </div>
          </div>

          <Upload {...uploadProps}>
            <Button
              type='primary'
              size='large'
              icon={<UploadIcon className='w-4 h-4' />}
              loading={loading}
              className='bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 shadow-lg shadow-green-500/25 px-8 py-3 h-auto text-base font-medium'>
              {loading ? '解析中...' : '选择文件'}
            </Button>
          </Upload>
        </div>
      </Card>
    </div>
  );
}
