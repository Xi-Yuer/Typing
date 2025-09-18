import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Popconfirm,
  Card,
  Input as AntInput,
  Row,
  Col,
  Statistic,
  Tabs,
  Descriptions
} from 'antd';
import {
  DeleteOutlined,
  SearchOutlined,
  BugOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import {
  getWordErrorReportsPaginated,
  deleteWordErrorReport,
  getWordErrorReportById,
  getWordErrorReportStats,
  getWordErrorReportsByStatus
} from '../../apis';
import type { ReportStatsDto, WordErrorReport } from '../../request/globals';

const ErrorReportManagement: React.FC = () => {
  const [reports, setReports] = useState<WordErrorReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<WordErrorReport | null>(
    null
  );
  const [stats, setStats] = useState<ReportStatsDto>({
    totalReports: 0,
    pendingReports: 0,
    reviewingReports: 0,
    acceptedReports: 0,
    rejectedReports: 0,
    recentReports: []
  });
  const prevPaginationRef = useRef(pagination);
  const prevSelectedStatusRef = useRef(selectedStatus);
  const fetchData = useCallback(async () => {
    try {
      // 获取统计信息
      const statsResponse = await getWordErrorReportStats();
      if (statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch {
      message.error('获取统计数据失败');
    }
  }, []);

  const fetchReports = useCallback(
    async (currentPage: number, pageSize: number, status: string) => {
      try {
        setLoading(true);
        let response;

        if (status) {
          response = await getWordErrorReportsByStatus(
            status as 'pending' | 'reviewing' | 'accepted' | 'rejected',
            { page: currentPage, pageSize }
          );
        } else {
          response = await getWordErrorReportsPaginated({
            page: currentPage,
            pageSize
          });
        }

        if (response.data) {
          setReports(response.data.list || []);
          setPagination(prev => ({
            ...prev,
            total: response.data.total || 0
          }));
        }
      } catch {
        message.error('获取错误报告列表失败');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchData();
    fetchReports(pagination.current, pagination.pageSize, selectedStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const prevPagination = prevPaginationRef.current;
    const prevSelectedStatus = prevSelectedStatusRef.current;

    const paginationChanged =
      prevPagination.current !== pagination.current ||
      prevPagination.pageSize !== pagination.pageSize;
    const statusChanged = prevSelectedStatus !== selectedStatus;

    if (paginationChanged || statusChanged) {
      fetchReports(pagination.current, pagination.pageSize, selectedStatus);
      prevPaginationRef.current = pagination;
      prevSelectedStatusRef.current = selectedStatus;
    }
  });

  const handleView = async (report: WordErrorReport) => {
    try {
      const response = await getWordErrorReportById(report.id);
      if (response.data) {
        setSelectedReport(response.data);
        setModalVisible(true);
      }
    } catch {
      message.error('获取报告详情失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWordErrorReport(id);
      message.success('删除成功');
      fetchReports(pagination.current, pagination.pageSize, selectedStatus);
      fetchData(); // 更新统计
    } catch {
      message.error('删除失败');
    }
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
    fetchReports(pagination.current, pagination.pageSize, selectedStatus);
  };

  const filteredReports = reports.filter(
    report =>
      report.errorDescription
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      report.errorDescription
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      report.word?.word.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'reviewing':
        return 'blue';
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待处理';
      case 'reviewing':
        return '审核中';
      case 'accepted':
        return '已接受';
      case 'rejected':
        return '已拒绝';
      default:
        return status;
    }
  };

  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case 'spelling':
        return 'red';
      case 'pronunciation':
        return 'blue';
      case 'translation':
        return 'green';
      case 'other':
        return 'default';
      default:
        return 'default';
    }
  };

  const getErrorTypeText = (type: string) => {
    switch (type) {
      case 'spelling':
        return '拼写错误';
      case 'pronunciation':
        return '发音错误';
      case 'translation':
        return '翻译错误';
      case 'other':
        return '其他';
      default:
        return type;
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id: string) => id.slice(0, 8) + '...'
    },
    {
      title: '单词',
      dataIndex: 'word',
      key: 'word',
      width: 120,
      render: (word: any) => word?.word || '未知'
    },
    {
      title: '错误类型',
      dataIndex: 'errorDescription',
      key: 'errorDescription',
      width: 100,
      render: (type: string) => (
        <Tag color={getErrorTypeColor(type)}>{getErrorTypeText(type)}</Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      )
    },
    {
      title: '报告人',
      dataIndex: 'user',
      key: 'user',
      width: 120,
      render: (user: any) => user?.name || '未知'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (description: string) => (
        <div
          style={{
            maxWidth: 180,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
          {description}
        </div>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: WordErrorReport) => (
        <Space size='middle'>
          <Button
            type='link'
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}>
            查看
          </Button>
          <Popconfirm
            title='确定要删除这个报告吗？'
            onConfirm={() => handleDelete(record.id)}
            okText='确定'
            cancelText='取消'>
            <Button type='link' danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const tabItems = [
    {
      key: '',
      label: `全部 (${stats.totalReports})`
    },
    {
      key: 'pending',
      label: `待处理 (${stats.pendingReports})`
    },
    {
      key: 'reviewing',
      label: `审核中 (${stats.reviewingReports})`
    },
    {
      key: 'accepted',
      label: `已接受 (${stats.acceptedReports})`
    },
    {
      key: 'rejected',
      label: `已拒绝 (${stats.rejectedReports})`
    }
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='总报告数'
              value={stats.totalReports}
              prefix={<BugOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='待处理'
              value={stats.pendingReports}
              prefix={<BugOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='已接受'
              value={stats.acceptedReports}
              prefix={<CheckOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='已拒绝'
              value={stats.rejectedReports}
              prefix={<CloseOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs
          items={tabItems}
          onChange={key => setSelectedStatus(key)}
          style={{ marginBottom: 16 }}
        />

        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16
          }}>
          <Space wrap>
            <AntInput
              placeholder='搜索报告...'
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredReports}
          rowKey='id'
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title='错误报告详情'
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key='close' onClick={() => setModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}>
        {selectedReport && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label='报告ID' span={2}>
              {selectedReport.id}
            </Descriptions.Item>
            <Descriptions.Item label='单词'>
              {selectedReport.word?.word || '未知'}
            </Descriptions.Item>
            <Descriptions.Item label='翻译'>
              {selectedReport.word?.meaning || '未知'}
            </Descriptions.Item>
            <Descriptions.Item label='错误类型'>
              <Tag color={getErrorTypeColor(selectedReport.errorDescription)}>
                {getErrorTypeText(selectedReport.errorDescription)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label='状态'>
              <Tag color={getStatusColor(selectedReport.status)}>
                {getStatusText(selectedReport.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label='报告人'>
              {selectedReport.user?.name || '未知'}
            </Descriptions.Item>
            <Descriptions.Item label='邮箱'>
              {selectedReport.user?.email || '未知'}
            </Descriptions.Item>
            <Descriptions.Item label='创建时间' span={2}>
              {new Date(selectedReport.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label='描述' span={2}>
              {selectedReport.errorDescription}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ErrorReportManagement;
