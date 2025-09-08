import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Spin } from 'antd';
import {
  UserOutlined,
  GlobalOutlined,
  BookOutlined,
  BugOutlined,
} from '@ant-design/icons';
import {
  getUserPaginated,
  getAllLanguages,
  getCorpusCategoriesPaginated,
  getWordErrorReportStats,
} from '../../apis';

interface DashboardStats {
  totalUsers: number;
  totalLanguages: number;
  totalCategories: number;
  pendingReports: number;
}

interface RecentUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalLanguages: 0,
    totalCategories: 0,
    pendingReports: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 获取用户统计
      const usersResponse = await getUserPaginated({ page: 1, pageSize: 1 });
      const totalUsers = usersResponse.data?.total || 0;

      // 获取语言统计
      const languagesResponse = await getAllLanguages();
      const totalLanguages = languagesResponse.data?.length || 0;

      // 获取分类统计
      const categoriesResponse = await getCorpusCategoriesPaginated({ page: 1, pageSize: 1 });
      const totalCategories = categoriesResponse.data?.total || 0;

      // 获取错误报告统计
      const reportsResponse = await getWordErrorReportStats();
      const pendingReports = reportsResponse.data?.pending || 0;

      setStats({
        totalUsers,
        totalLanguages,
        totalCategories,
        pendingReports,
      });

      // 获取最近用户
      const recentUsersResponse = await getUserPaginated({ page: 1, pageSize: 5 });
      setRecentUsers(recentUsersResponse.data?.data || []);

    } catch (error) {
      console.error('获取仪表板数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const userColumns = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? '管理员' : '用户'}
        </Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>仪表板</h1>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="支持语言"
              value={stats.totalLanguages}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="语料库分类"
              value={stats.totalCategories}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待处理报告"
              value={stats.pendingReports}
              prefix={<BugOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="最近注册用户" style={{ height: 400 }}>
            <Table
              dataSource={recentUsers}
              columns={userColumns}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="系统状态" style={{ height: 400 }}>
            <div style={{ padding: '20px 0' }}>
              <div style={{ marginBottom: 16 }}>
                <strong>API 服务状态：</strong>
                <Tag color="green">正常</Tag>
              </div>
              <div style={{ marginBottom: 16 }}>
                <strong>数据库状态：</strong>
                <Tag color="green">正常</Tag>
              </div>
              <div style={{ marginBottom: 16 }}>
                <strong>文件存储：</strong>
                <Tag color="green">正常</Tag>
              </div>
              <div>
                <strong>系统版本：</strong>
                <span>v1.0.0</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
