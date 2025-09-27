'use client';
import React from 'react';
import ReactECharts from 'echarts-for-react';
import { darkTheme, commonChartOptions } from './ChartTheme';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  height?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, height = 400 }) => {
  const option = {
    ...commonChartOptions,
    title: undefined,
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#475569',
      borderWidth: 1,
      textStyle: {
        color: '#e2e8f0'
      },
      extraCssText:
        'border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);'
    },
    legend: false,
    series: [
      {
        name: '数据',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#1e293b',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {d}%',
          color: '#e2e8f0',
          fontSize: 12
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(125, 38, 205, 0.5)'
          }
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: '#475569'
          }
        },
        data: data
      }
    ]
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: `${height}px`, width: '100%' }}
      theme={darkTheme}
    />
  );
};
