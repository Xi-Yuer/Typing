import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Card,
  Input as AntInput,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  BookOutlined
} from '@ant-design/icons';
import {
  getAllCorpusCategories,
  createCorpusCategory,
  deleteCorpusCategory,
  getCorpusCategoryById,
  getAllLanguages
} from '../../apis';
import type {
  CorpusCategory,
  CreateCorpusCategoryDto,
  Language
} from '../../request/globals';

const CorpusCategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<CorpusCategory[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CorpusCategory | null>(
    null
  );
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 获取分类列表
      const categoriesResponse = await getAllCorpusCategories();
      if (categoriesResponse.data) {
        setCategories(categoriesResponse.data.list);
      }

      // 获取语言列表
      const languagesResponse = await getAllLanguages();
      if (languagesResponse.data) {
        setLanguages(languagesResponse.data.list);
      }
    } catch {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = async (category: CorpusCategory) => {
    try {
      const response = await getCorpusCategoryById(category.id);
      if (response.data) {
        setEditingCategory(response.data);
        form.setFieldsValue(response.data);
        setModalVisible(true);
      }
    } catch {
      message.error('获取分类信息失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCorpusCategory(id);
      message.success('删除成功');
      fetchData();
    } catch {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingCategory) {
        // 更新分类逻辑（API中暂无更新接口）
        message.info('更新功能暂未实现');
      } else {
        // 创建分类
        const createData: CreateCorpusCategoryDto = {
          name: values.name,
          description: values.description,
          languageId: values.languageId,
          difficulty: values.difficulty
        };

        await createCorpusCategory(createData);
        message.success('创建成功');
        setModalVisible(false);
        fetchData();
      }
    } catch {
      message.error('操作失败');
    }
  };

  const filteredCategories = categories.filter(
    category =>
      category.name.toLowerCase().includes(searchText.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'green';
    if (difficulty <= 4) return 'orange';
    return 'red';
  };

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 2) return '简单';
    if (difficulty <= 4) return '中等';
    return '困难';
  };

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '语言',
      dataIndex: 'language',
      key: 'language',
      render: (language: any) => (
        <Tag color='blue'>{language?.name || '未知'}</Tag>
      )
    },
    {
      title: '难度等级',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty: number) => (
        <Tag color={getDifficultyColor(difficulty)}>
          {difficulty} - {getDifficultyText(difficulty)}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CorpusCategory) => (
        <Space size='middle'>
          <Button
            type='link'
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title='确定要删除这个分类吗？'
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

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='总分类数'
              value={categories.length}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='支持语言'
              value={languages.length}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='简单分类'
              value={categories.filter(c => c.difficulty <= 2).length}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='困难分类'
              value={categories.filter(c => c.difficulty > 4).length}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between'
          }}>
          <Space>
            <AntInput
              placeholder='搜索分类...'
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
          </Space>
          <Button type='primary' icon={<PlusOutlined />} onClick={handleCreate}>
            创建分类
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCategories}
          rowKey='id'
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
        />
      </Card>

      <Modal
        title={editingCategory ? '编辑分类' : '创建分类'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}>
        <Form form={form} layout='vertical'>
          <Form.Item
            name='name'
            label='分类名称'
            rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder='请输入分类名称' />
          </Form.Item>

          <Form.Item
            name='description'
            label='描述'
            rules={[{ required: true, message: '请输入描述' }]}>
            <Input.TextArea rows={3} placeholder='请输入分类描述' />
          </Form.Item>

          <Form.Item
            name='languageId'
            label='所属语言'
            rules={[{ required: true, message: '请选择语言' }]}>
            <Select placeholder='请选择语言'>
              {languages.map(language => (
                <Select.Option key={language.id} value={language.id.toString()}>
                  {language.name} ({language.code})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name='difficulty'
            label='难度等级'
            rules={[{ required: true, message: '请选择难度等级' }]}>
            <InputNumber
              min={1}
              max={5}
              placeholder='1-5，数字越大越难'
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CorpusCategoryManagement;
