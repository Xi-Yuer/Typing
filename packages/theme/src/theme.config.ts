/**
 * 主题配置文件
 * 定义橙色系主题的主色调和派生颜色
 */

// 主色调定义
export const PRIMARY_COLOR = '#f54a00';

// 颜色映射表 - 从紫色到橙色的映射
export const COLOR_MAPPING = {
  // 主色调
  primary: '#fa8c16',
  primaryLight: '#ffa940',
  primaryDark: '#d46a00',

  // 渐变色彩
  gradientStart: '#ff9c6e',
  gradientEnd: '#d46a00',

  // 亮色调
  bright: '#ffa940',
  brightLight: '#ffb84d',

  // 深色调
  dark: '#d46a00',
  darkDarker: '#ad5500',

  // 浅色调
  light: '#ff9c6e',
  lightLighter: '#ffb366',

  // 透明度变体
  primaryAlpha20: '#fa8c1633',
  primaryAlpha50: '#fa8c1680',
  primaryAlpha80: '#fa8c16cc',

  // 旧紫色映射（用于替换）
  oldPrimary: '#7d26cd',
  oldBright: '#8c21f1',
  oldGradientStart: '#667eea',
  oldGradientEnd: '#764ba2',
  oldPurple: '#8b5cf6'
} as const;

// Ant Design 主题配置
export const antdTheme = {
  token: {
    colorPrimary: PRIMARY_COLOR,
    colorText: '#fff',
    colorBgContainer: `${PRIMARY_COLOR}20`,
    colorBgElevated: '#1e273a',
    colorError: PRIMARY_COLOR,
    colorErrorText: PRIMARY_COLOR,
    colorSuccess: PRIMARY_COLOR,
    colorBorderSecondary: `${PRIMARY_COLOR}20`
  },
  components: {
    Button: {
      colorBorder: '#4b5563',
      primaryShadow: 'none'
    },
    Input: {
      colorBorder: '#4b5563',
      activeBorderColor: '#4b5563',
      activeShadow: 'none'
    },
    Segmented: {
      colorBorder: '#4b5563',
      colorBorderSecondary: '#4b5563',
      colorBgContainer: '#e25606',
      itemSelectedBg: PRIMARY_COLOR,
      itemSelectedColor: '#fff',
      itemColor: '#fff'
    },
    Select: {
      colorBorder: 'transparent',
      activeBorderColor: 'transparent',
      activeOutlineColor: 'transparent',
      colorBgContainer: '#1e293b',
      colorBgElevated: '#1e293b',
      colorText: '#e2e8f0',
      colorTextPlaceholder: '#94a3b8',
      colorTextQuaternary: '#94a3b8',
      colorBgTextActive: PRIMARY_COLOR,
      colorBgTextHover: '#334155',
      optionSelectedBg: PRIMARY_COLOR,
      optionActiveBg: '#334155'
    },
    Message: {
      colorInfo: PRIMARY_COLOR,
      colorInfoText: PRIMARY_COLOR,
      colorSuccess: PRIMARY_COLOR,
      colorSuccessText: PRIMARY_COLOR,
      colorError: PRIMARY_COLOR,
      colorErrorText: PRIMARY_COLOR,
      colorWarning: PRIMARY_COLOR,
      colorWarningText: PRIMARY_COLOR
    },
    Slider: {
      railBg: `${PRIMARY_COLOR}50`,
      railHoverBg: `${PRIMARY_COLOR}50`,
      dotBorderColor: PRIMARY_COLOR,
      handleColor: PRIMARY_COLOR,
      trackBg: PRIMARY_COLOR
    }
  }
};

// CSS 渐变定义
export const gradients = {
  primary: `linear-gradient(135deg, ${COLOR_MAPPING.gradientStart} 0%, ${COLOR_MAPPING.gradientEnd} 100%)`,
  primaryHover: `linear-gradient(135deg, ${COLOR_MAPPING.lightLighter} 0%, ${COLOR_MAPPING.darkDarker} 100%)`,
  bright: `linear-gradient(135deg, ${COLOR_MAPPING.bright} 0%, ${COLOR_MAPPING.brightLight} 100%)`,
  brightHover: `linear-gradient(135deg, ${COLOR_MAPPING.brightLight} 0%, ${COLOR_MAPPING.bright} 100%)`
} as const;

// Tailwind CSS 颜色配置
export const tailwindColors = {
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: PRIMARY_COLOR,
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407'
  }
} as const;

// ECharts 主题配置
export const echartsTheme = {
  color: [
    PRIMARY_COLOR, // 主色调橙色
    COLOR_MAPPING.primaryLight, // 浅橙色
    COLOR_MAPPING.bright, // 亮橙色
    COLOR_MAPPING.light, // 更浅橙色
    '#ffb366', // 淡橙色
    '#3b82f6', // 蓝色
    '#06b6d4', // 青色
    '#10b981', // 绿色
    '#f59e0b', // 黄色
    '#ef4444' // 红色
  ],
  backgroundColor: 'transparent',
  textStyle: {
    color: '#e2e8f0'
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

// 类型定义
export type ThemeColor = keyof typeof COLOR_MAPPING;
export type GradientType = keyof typeof gradients;

// 工具函数
export const getColor = (colorName: ThemeColor): string => {
  return COLOR_MAPPING[colorName];
};

export const getGradient = (gradientType: GradientType): string => {
  return gradients[gradientType];
};

export const getAntdTheme = () => antdTheme;
export const getEchartsTheme = () => echartsTheme;
export const getTailwindColors = () => tailwindColors;
