// ECharts 主题配置，符合网站深色风格
import { getEchartsTheme } from '@typing/theme';

export const darkTheme = getEchartsTheme();

// 通用图表配置
export const commonChartOptions = {
  animation: true,
  animationDuration: 1000,
  animationEasing: 'cubicOut',
  textStyle: {
    color: '#e2e8f0'
  }
};
