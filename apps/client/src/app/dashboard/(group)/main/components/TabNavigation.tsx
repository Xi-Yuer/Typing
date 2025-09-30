'use client';
import React from 'react';
import { Segmented } from 'antd';
import { BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'overview' | 'languages' | 'categories';
  onTabChange: (value: 'overview' | 'languages' | 'categories') => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange
}: TabNavigationProps) {
  return (
    <div className='mb-8'>
      <Segmented
        value={activeTab}
        onChange={value => onTabChange(value as any)}
        options={[
          {
            label: (
              <div className='flex items-center justify-center space-x-2 px-2'>
                <PieChartIcon className='w-4 h-4' />
                <span>概览分析</span>
              </div>
            ),
            value: 'overview'
          },
          {
            label: (
              <div className='flex items-center justify-center space-x-2 px-2'>
                <BarChart3 className='w-4 h-4' />
                <span>语言统计</span>
              </div>
            ),
            value: 'languages'
          },
          {
            label: (
              <div className='flex items-center justify-center space-x-2 px-2'>
                <Activity className='w-4 h-4' />
                <span>分类统计</span>
              </div>
            ),
            value: 'categories'
          }
        ]}
        size='large'
        block
        className='custom-segmented bg-slate-800/50 border border-slate-600'
        style={{
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgb(71, 85, 105)',
          borderRadius: '8px',
          padding: '5px',
          textAlign: 'center'
        }}
      />
    </div>
  );
}
