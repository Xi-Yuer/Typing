import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Popconfirm,
  Card,
  Input as AntInput,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  getAllLanguages,
  createLanguage,
  deleteLanguage,
  getLanguageById,
} from '../../apis';
import type { CreateLanguageDto } from '../../request/globals';

interface Language {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const LanguageManagement: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const response = await getAllLanguages();
      
      if (response.data) {
        setLanguages(response.data);
      }
    } catch (error) {
      message.error('获取语言列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingLanguage(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = async (language: Language) => {
    try {
      const response = await getLanguageById(language.id);
      if (response.data) {
        setEditingLanguage(response.data);
        form.setFieldsValue(response.data);
        setModalVisible(true);
      }
    } catch (error) {
      message.error('获取语言信息失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLanguage(id);
      message.success('删除成功');
      fetchLanguages();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingLanguage) {
        // 更新语言逻辑（API中暂无更新接口）
        message.info('更新功能暂未实现');
      } else {
        // 创建语言
        const createData: CreateLanguageDto = {
          name: values.name,
          code: values.code,
          isActive: values.isActive ?? true,
        };
        
        await createLanguage(createData);
        message.success('创建成功');
        setModalVisible(false);
        fetchLanguages();
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const filteredLanguages = languages.filter(language =>
    language.name.toLowerCase().includes(searchText.toLowerCase()) ||
    language.code.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '语言名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '语言代码',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => (
        <Tag color="blue">{code.toUpperCase()}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Language) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个语言吗？"
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

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <AntInput
              placeholder="搜索语言..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建语言
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredLanguages}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title={editingLanguage ? '编辑语言' : '创建语言'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ isActive: true }}
        >
          <Form.Item
            name="name"
            label="语言名称"
            rules={[{ required: true, message: '请输入语言名称' }]}
          >
            <Input placeholder="请输入语言名称，如：英语" />
          </Form.Item>

          <Form.Item
            name="code"
            label="语言代码"
            rules={[{ required: true, message: '请输入语言代码' }]}
          >
            <Input placeholder="请输入语言代码，如：en" />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="启用状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LanguageManagement;
