'use client';
import React from 'react';
import ReactECharts from 'echarts-for-react';
import { darkTheme, commonChartOptions } from './ChartTheme';

interface LineChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title?: string;
  height?: number;
  xAxisName?: string;
  yAxisName?: string;
  showDataLabel?: boolean;
  smooth?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 400,
  xAxisName = '类别',
  yAxisName = '数值',
  showDataLabel = false,
  smooth = true
}) => {
  const option = {
    ...commonChartOptions,
    title: title
      ? {
          text: title,
          left: 'center',
          top: 20,
          textStyle: {
            color: '#ffffff',
            fontSize: 18,
            fontWeight: 'bold'
          }
        }
      : undefined,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#475569',
      borderWidth: 1,
      textStyle: {
        color: '#e2e8f0'
      },
      extraCssText:
        'border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      borderColor: '#475569',
      borderWidth: 1
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        lineStyle: {
          color: '#475569'
        }
      },
      axisLabel: {
        color: '#94a3b8',
        rotate: data.length > 6 ? 45 : 0
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#475569'
        }
      },
      axisLabel: {
        color: '#94a3b8'
      },
      splitLine: {
        lineStyle: {
          color: '#334155'
        }
      }
    },
    series: [
      {
        name: yAxisName,
        type: 'line',
        smooth: smooth,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: '#fa8c16'
              },
              {
                offset: 1,
                color: '#ffa940'
              }
            ]
          }
        },
        itemStyle: {
          color: '#fa8c16',
          borderColor: '#ffffff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(125, 38, 205, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(125, 38, 205, 0.05)'
              }
            ]
          }
        },
        emphasis: {
          itemStyle: {
            color: '#ffa940',
            shadowBlur: 10,
            shadowColor: 'rgba(125, 38, 205, 0.5)'
          }
        },
        label: showDataLabel
          ? {
              show: true,
              position: 'top',
              color: '#e2e8f0',
              fontSize: 12
            }
          : undefined,
        data: data.map(item => item.value)
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
