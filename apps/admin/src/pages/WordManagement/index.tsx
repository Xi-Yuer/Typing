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
  getWordsPaginated,
  createWord,
  deleteWord,
  getWordById,
  getWordLanguageStats,
  getWordCategoryStats,
  getAllLanguages,
  getAllCorpusCategories,
} from '../../apis';
import type { CreateWordDto } from '../../request/globals';

interface Word {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
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

const WordManagement: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
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
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchWords();
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

  const fetchWords = async () => {
    try {
      setLoading(true);
      const response = await getWordsPaginated({
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      
      if (response.data) {
        let filteredWords = response.data.data || [];
        
        // 根据选择的语言和分类过滤
        if (selectedLanguage) {
          filteredWords = filteredWords.filter((word: Word) => 
            word.languageId === selectedLanguage
          );
        }
        
        if (selectedCategory) {
          filteredWords = filteredWords.filter((word: Word) => 
            word.categoryId === selectedCategory
          );
        }
        
        setWords(filteredWords);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0,
        }));
      }
    } catch (error) {
      message.error('获取单词列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingWord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = async (word: Word) => {
    try {
      const response = await getWordById(word.id);
      if (response.data) {
        setEditingWord(response.data);
        form.setFieldsValue(response.data);
        setModalVisible(true);
      }
    } catch (error) {
      message.error('获取单词信息失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWord(id);
      message.success('删除成功');
      fetchWords();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingWord) {
        // 更新单词逻辑（API中暂无更新接口）
        message.info('更新功能暂未实现');
      } else {
        // 创建单词
        const createData: CreateWordDto = {
          word: values.word,
          translation: values.translation,
          pronunciation: values.pronunciation,
          languageId: values.languageId,
          categoryId: values.categoryId,
        };
        
        await createWord(createData);
        message.success('创建成功');
        setModalVisible(false);
        fetchWords();
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const filteredWords = words.filter(word =>
    word.word.toLowerCase().includes(searchText.toLowerCase()) ||
    word.translation.toLowerCase().includes(searchText.toLowerCase())
  );

  const getFilteredCategories = () => {
    if (!selectedLanguage) return categories;
    return categories.filter(cat => cat.languageId === selectedLanguage);
  };

  const columns = [
    {
      title: '单词',
      dataIndex: 'word',
      key: 'word',
      render: (word: string) => (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{word}</span>
      ),
    },
    {
      title: '翻译',
      dataIndex: 'translation',
      key: 'translation',
    },
    {
      title: '发音',
      dataIndex: 'pronunciation',
      key: 'pronunciation',
      render: (pronunciation: string) => (
        <Space>
          <span>{pronunciation}</span>
          <Button
            type="link"
            size="small"
            icon={<SoundOutlined />}
            onClick={() => {
              // 这里可以调用语音API
              message.info('语音播放功能待实现');
            }}
          />
        </Space>
      ),
    },
    {
      title: '语言',
      dataIndex: 'language',
      key: 'language',
      render: (language: any) => (
        <Tag color="blue">{language?.name || '未知'}</Tag>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: any) => (
        <Tag color="green">{category?.name || '未知'}</Tag>
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
      render: (_: any, record: Word) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个单词吗？"
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
              title="总单词数"
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
              value={words.length}
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
              placeholder="搜索单词..."
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
            创建单词
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredWords}
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
        />
      </Card>

      <Modal
        title={editingWord ? '编辑单词' : '创建单词'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="word"
            label="单词"
            rules={[{ required: true, message: '请输入单词' }]}
          >
            <Input placeholder="请输入单词" />
          </Form.Item>

          <Form.Item
            name="translation"
            label="翻译"
            rules={[{ required: true, message: '请输入翻译' }]}
          >
            <Input placeholder="请输入翻译" />
          </Form.Item>

          <Form.Item
            name="pronunciation"
            label="发音"
            rules={[{ required: true, message: '请输入发音' }]}
          >
            <Input placeholder="请输入发音，如：/ˈhæpi/" />
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

export default WordManagement;
