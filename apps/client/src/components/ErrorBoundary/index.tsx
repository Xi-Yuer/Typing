'use client';
import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误信息
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 更新状态
    this.setState({
      error,
      errorInfo
    });

    // 调用外部错误处理函数
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    // 重置错误状态
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误 UI
      return (
        <div className='bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen flex items-center justify-center p-4'>
          <div className='text-center space-y-6 max-w-md mx-auto'>
            <div className='w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto'>
              <AlertTriangle className='w-10 h-10 text-red-400' />
            </div>

            <div className='space-y-2'>
              <h2 className='text-2xl text-red-400 font-semibold'>
                页面出现错误
              </h2>
              <p className='text-gray-400'>
                抱歉，页面遇到了意外错误。请尝试刷新页面或联系技术支持。
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className='bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-left'>
                <h3 className='text-red-400 font-medium mb-2'>
                  错误详情 (开发模式)
                </h3>
                <pre className='text-xs text-gray-300 whitespace-pre-wrap break-words'>
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <details className='mt-2'>
                    <summary className='text-red-400 cursor-pointer text-xs'>
                      组件堆栈信息
                    </summary>
                    <pre className='text-xs text-gray-400 mt-1 whitespace-pre-wrap'>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className='flex gap-3 justify-center'>
              <button
                onClick={this.handleRetry}
                className='flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors duration-200 border border-red-500/30'>
                <RefreshCw className='w-4 h-4' />
                重试
              </button>

              <button
                onClick={() => window.location.reload()}
                className='px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 rounded-lg transition-colors duration-200 border border-slate-600/50'>
                刷新页面
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
