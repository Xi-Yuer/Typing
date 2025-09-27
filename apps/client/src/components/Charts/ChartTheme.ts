// ECharts 主题配置，符合网站深色风格
export const darkTheme = {
  color: [
    '#7d26cd', // 主色调紫色
    '#8b5cf6', // 浅紫色
    '#a855f7', // 更浅紫色
    '#c084fc', // 淡紫色
    '#e879f9', // 粉紫色
    '#3b82f6', // 蓝色
    '#06b6d4', // 青色
    '#10b981', // 绿色
    '#f59e0b', // 橙色
    '#ef4444' // 红色
  ],
  backgroundColor: 'transparent',
  textStyle: {
    color: '#e2e8f0' // 浅灰色文字
  },
  title: {
    textStyle: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold'
    },
    subtextStyle: {
      color: '#94a3b8',
      fontSize: 14
    }
  },
  legend: {
    textStyle: {
      color: '#e2e8f0'
    },
    itemGap: 20
  },
  grid: {
    borderColor: '#475569',
    borderWidth: 1
  },
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: '#475569'
      }
    },
    axisTick: {
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
  valueAxis: {
    axisLine: {
      lineStyle: {
        color: '#475569'
      }
    },
    axisTick: {
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
  tooltip: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderColor: '#475569',
    borderWidth: 1,
    textStyle: {
      color: '#e2e8f0'
    },
    extraCssText:
      'border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);'
  }
};

// 通用图表配置
export const commonChartOptions = {
  animation: true,
  animationDuration: 1000,
  animationEasing: 'cubicOut',
  textStyle: {
    color: '#e2e8f0'
  }
};
