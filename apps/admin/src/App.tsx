import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { ConfigProvider } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider } from './hooks/AuthContext.tsx';
import { useAuth } from './hooks/useAuth';
import AppLayout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import LanguageManagement from './pages/LanguageManagement';
import CorpusCategoryManagement from './pages/CorpusCategoryManagement';
import WordManagement from './pages/WordManagement';
import SentenceManagement from './pages/SentenceManagement';
import ErrorReportManagement from './pages/ErrorReportManagement';

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <div>加载中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

// 公开路由组件（已登录用户重定向到仪表板）
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <div>加载中...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Routes>
            <Route
              path='/login'
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/users'
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path='/languages'
              element={
                <ProtectedRoute>
                  <LanguageManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path='/corpus-categories'
              element={
                <ProtectedRoute>
                  <CorpusCategoryManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path='/words'
              element={
                <ProtectedRoute>
                  <WordManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path='/sentences'
              element={
                <ProtectedRoute>
                  <SentenceManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path='/error-reports'
              element={
                <ProtectedRoute>
                  <ErrorReportManagement />
                </ProtectedRoute>
              }
            />
            <Route path='/' element={<Navigate to='/dashboard' replace />} />
            <Route path='*' element={<Navigate to='/dashboard' replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
