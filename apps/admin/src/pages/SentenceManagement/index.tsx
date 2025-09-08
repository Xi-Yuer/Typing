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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FileTextOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import {
  getSentencesPaginated,
  createSentence,
  deleteSentence,
  getSentenceById,
  getSentenceLanguageStats,
  getSentenceCategoryStats,
  getAllLanguages,
  getAllCorpusCategories,
} from '../../apis';
import type { CreateSentenceDto } from '../../request/globals';

interface Sentence {
  id: string;
  text: string;
  translation: string;
  languageId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  language?: {
    id: number;
    name: string;
    code: string;
  };
  category?: {
    id: string;
    name: string;
    difficulty: number;
  };
}

interface Language {
  id: number;
  name: string;
  code: string;
}

interface Category {
  id: string;
  name: string;
  difficulty: number;
  languageId: string;
}

const SentenceManagement: React.FC = () => {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSentence, setEditingSentence] = useState<Sentence | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchSentences();
  }, [pagination.current, pagination.pageSize, selectedLanguage, selectedCategory]);

  const fetchData = async () => {
    try {
      // 获取语言列表
      const languagesResponse = await getAllLanguages();
      if (languagesResponse.data) {
        setLanguages(languagesResponse.data);
      }

      // 获取分类列表
      const categoriesResponse = await getAllCorpusCategories();
      if (categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      message.error('获取基础数据失败');
    }
  };

  const fetchSentences = async () => {
    try {
      setLoading(true);
      const response = await getSentencesPaginated({
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      
      if (response.data) {
        let filteredSentences = response.data.data || [];
        
        // 根据选择的语言和分类过滤
        if (selectedLanguage) {
          filteredSentences = filteredSentences.filter((sentence: Sentence) => 
            sentence.languageId === selectedLanguage
          );
        }
        
        if (selectedCategory) {
          filteredSentences = filteredSentences.filter((sentence: Sentence) => 
            sentence.categoryId === selectedCategory
          );
        }
        
        setSentences(filteredSentences);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0,
        }));
      }
    } catch (error) {
      message.error('获取句子列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSentence(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = async (sentence: Sentence) => {
    try {
      const response = await getSentenceById(sentence.id);
      if (response.data) {
        setEditingSentence(response.data);
        form.setFieldsValue(response.data);
        setModalVisible(true);
      }
    } catch (error) {
      message.error('获取句子信息失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSentence(id);
      message.success('删除成功');
      fetchSentences();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingSentence) {
        // 更新句子逻辑（API中暂无更新接口）
        message.info('更新功能暂未实现');
      } else {
        // 创建句子
        const createData: CreateSentenceDto = {
          text: values.text,
          translation: values.translation,
          languageId: values.languageId,
          categoryId: values.categoryId,
        };
        
        await createSentence(createData);
        message.success('创建成功');
        setModalVisible(false);
        fetchSentences();
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const filteredSentences = sentences.filter(sentence =>
    sentence.text.toLowerCase().includes(searchText.toLowerCase()) ||
    sentence.translation.toLowerCase().includes(searchText.toLowerCase())
  );

  const getFilteredCategories = () => {
    if (!selectedLanguage) return categories;
    return categories.filter(cat => cat.languageId === selectedLanguage);
  };

  const columns = [
    {
      title: '句子',
      dataIndex: 'text',
      key: 'text',
      width: 300,
      render: (text: string) => (
        <div style={{ 
          maxWidth: 280, 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {text}
        </div>
      ),
    },
    {
      title: '翻译',
      dataIndex: 'translation',
      key: 'translation',
      width: 200,
      render: (translation: string) => (
        <div style={{ 
          maxWidth: 180, 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {translation}
        </div>
      ),
    },
    {
      title: '语言',
      dataIndex: 'language',
      key: 'language',
      width: 100,
      render: (language: any) => (
        <Tag color="blue">{language?.name || '未知'}</Tag>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: any) => (
        <Tag color="green">{category?.name || '未知'}</Tag>
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
      render: (_: any, record: Sentence) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个句子吗？"
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
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总句子数"
              value={pagination.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="支持语言"
              value={languages.length}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="分类数量"
              value={categories.length}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="当前页"
              value={sentences.length}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <AntInput
              placeholder="搜索句子..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="选择语言"
              value={selectedLanguage}
              onChange={setSelectedLanguage}
              style={{ width: 150 }}
              allowClear
            >
              {languages.map(language => (
                <Select.Option key={language.id} value={language.id.toString()}>
                  {language.name}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="选择分类"
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 150 }}
              allowClear
            >
              {getFilteredCategories().map(category => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建句子
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredSentences}
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
        title={editingSentence ? '编辑句子' : '创建句子'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="text"
            label="句子内容"
            rules={[{ required: true, message: '请输入句子内容' }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="请输入句子内容" 
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="translation"
            label="翻译"
            rules={[{ required: true, message: '请输入翻译' }]}
          >
            <Input.TextArea 
              rows={2} 
              placeholder="请输入翻译" 
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="languageId"
            label="所属语言"
            rules={[{ required: true, message: '请选择语言' }]}
          >
            <Select placeholder="请选择语言">
              {languages.map(language => (
                <Select.Option key={language.id} value={language.id.toString()}>
                  {language.name} ({language.code})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="所属分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              {categories.map(category => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name} (难度: {category.difficulty})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SentenceManagement;
