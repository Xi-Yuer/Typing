import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Card,
  Input as AntInput,
  Row,
  Col,
  Statistic,
  Tabs,
  Descriptions,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  BugOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  getWordErrorReportsPaginated,
  deleteWordErrorReport,
  getWordErrorReportById,
  getWordErrorReportStats,
  getWordErrorReportsByStatus,
} from '../../apis';

interface ErrorReport {
  id: string;
  wordId: string;
  userId: number;
  errorType: string;
  description: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  word?: {
    id: string;
    word: string;
    translation: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface ReportStats {
  total: number;
  pending: number;
  reviewing: number;
  accepted: number;
  rejected: number;
}

const ErrorReportManagement: React.FC = () => {
  const [reports, setReports] = useState<ErrorReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ErrorReport | null>(null);
  const [stats, setStats] = useState<ReportStats>({
    total: 0,
    pending: 0,
    reviewing: 0,
    accepted: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [pagination.current, pagination.pageSize, selectedStatus]);

  const fetchData = async () => {
    try {
      // 获取统计信息
      const statsResponse = await getWordErrorReportStats();
      if (statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      message.error('获取统计数据失败');
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      let response;
      
      if (selectedStatus) {
        response = await getWordErrorReportsByStatus(
          selectedStatus as 'pending' | 'reviewing' | 'accepted' | 'rejected',
          { page: pagination.current, pageSize: pagination.pageSize }
        );
      } else {
        response = await getWordErrorReportsPaginated({
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
      }
      
      if (response.data) {
        setReports(response.data.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0,
        }));
      }
    } catch (error) {
      message.error('获取错误报告列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (report: ErrorReport) => {
    try {
      const response = await getWordErrorReportById(report.id);
      if (response.data) {
        setSelectedReport(response.data);
        setModalVisible(true);
      }
    } catch (error) {
      message.error('获取报告详情失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWordErrorReport(id);
      message.success('删除成功');
      fetchReports();
      fetchData(); // 更新统计
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const filteredReports = reports.filter(report =>
    report.description.toLowerCase().includes(searchText.toLowerCase()) ||
    report.errorType.toLowerCase().includes(searchText.toLowerCase()) ||
    report.word?.word.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'reviewing': return 'blue';
      case 'accepted': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待处理';
      case 'reviewing': return '审核中';
      case 'accepted': return '已接受';
      case 'rejected': return '已拒绝';
      default: return status;
    }
  };

  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case 'spelling': return 'red';
      case 'pronunciation': return 'blue';
      case 'translation': return 'green';
      case 'other': return 'default';
      default: return 'default';
    }
  };

  const getErrorTypeText = (type: string) => {
    switch (type) {
      case 'spelling': return '拼写错误';
      case 'pronunciation': return '发音错误';
      case 'translation': return '翻译错误';
      case 'other': return '其他';
      default: return type;
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id: string) => id.slice(0, 8) + '...',
    },
    {
      title: '单词',
      dataIndex: 'word',
      key: 'word',
      width: 120,
      render: (word: any) => word?.word || '未知',
    },
    {
      title: '错误类型',
      dataIndex: 'errorType',
      key: 'errorType',
      width: 100,
      render: (type: string) => (
        <Tag color={getErrorTypeColor(type)}>
          {getErrorTypeText(type)}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '报告人',
      dataIndex: 'user',
      key: 'user',
      width: 120,
      render: (user: any) => user?.name || '未知',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (description: string) => (
        <div style={{ 
          maxWidth: 180, 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {description}
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: ErrorReport) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Popconfirm
            title="确定要删除这个报告吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: '',
      label: `全部 (${stats.total})`,
    },
    {
      key: 'pending',
      label: `待处理 (${stats.pending})`,
    },
    {
      key: 'reviewing',
      label: `审核中 (${stats.reviewing})`,
    },
    {
      key: 'accepted',
      label: `已接受 (${stats.accepted})`,
    },
    {
      key: 'rejected',
      label: `已拒绝 (${stats.rejected})`,
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总报告数"
              value={stats.total}
              prefix={<BugOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待处理"
              value={stats.pending}
              prefix={<BugOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已接受"
              value={stats.accepted}
              prefix={<CheckOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已拒绝"
              value={stats.rejected}
              prefix={<CloseOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs
          items={tabItems}
          onChange={(key) => setSelectedStatus(key)}
          style={{ marginBottom: 16 }}
        />

        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <AntInput
              placeholder="搜索报告..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredReports}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title="错误报告详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedReport && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="报告ID" span={2}>
              {selectedReport.id}
            </Descriptions.Item>
            <Descriptions.Item label="单词">
              {selectedReport.word?.word || '未知'}
            </Descriptions.Item>
            <Descriptions.Item label="翻译">
              {selectedReport.word?.translation || '未知'}
            </Descriptions.Item>
            <Descriptions.Item label="错误类型">
              <Tag color={getErrorTypeColor(selectedReport.errorType)}>
                {getErrorTypeText(selectedReport.errorType)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={getStatusColor(selectedReport.status)}>
                {getStatusText(selectedReport.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="报告人">
              {selectedReport.user?.name || '未知'}
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">
              {selectedReport.user?.email || '未知'}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>
              {new Date(selectedReport.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="描述" span={2}>
              {selectedReport.description}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ErrorReportManagement;
