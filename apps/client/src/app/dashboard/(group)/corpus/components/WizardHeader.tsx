'use client';
import React from 'react';
import { Progress, Typography } from 'antd';

const { Text } = Typography;

interface WizardHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
}

export default function WizardHeader({
  currentStep,
  totalSteps
}: WizardHeaderProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className='space-y-6'>
      {/* 进度条 */}
      <div className='space-y-3'>
        <div className='flex justify-between items-center'>
          <Text className='text-sm text-gray-300 font-medium'>导入进度</Text>
          <Text className='text-sm text-blue-400 font-medium'>
            步骤 {currentStep + 1} / {totalSteps}
          </Text>
        </div>
        <Progress
          percent={progress}
          showInfo={false}
          strokeColor={{
            '0%': '#3b82f6',
            '100%': '#1d4ed8'
          }}
          trailColor='rgba(255, 255, 255, 0.1)'
          size='small'
          className='wizard-progress'
        />
      </div>
    </div>
  );
}
