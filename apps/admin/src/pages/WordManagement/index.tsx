import React, { useState, useEffect, useCallback } from 'react';
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
  Statistic
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FileTextOutlined,
  SoundOutlined
} from '@ant-design/icons';
import {
  createWord,
  deleteWord,
  getWordById,
  getWordsByLanguageAndCategory,
  getActiveLanguages,
  getCorpusCategoriesByLanguage,
  updateWord
} from '../../apis';
import type {
  CorpusCategory,
  CreateWordDto,
  Language,
  Word
} from '../../request/globals';
import { playWordAudio } from '@/hooks/useSpeech';
const WordManagement: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [categories, setCategories] = useState<CorpusCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [wordsCount, setWordsCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      // 获取语言列表
      const languagesResponse = await getActiveLanguages();
      if (languagesResponse.data) {
        setLanguages(languagesResponse.data.list);
        setSelectedLanguage(languagesResponse.data.list[0].id.toString());
      }

      // 获取分类列表
      const categoriesResponse = await getCorpusCategoriesByLanguage(
        languagesResponse.data.list[0].id.toString()
      );
      if (categoriesResponse.data) {
        setCategories(categoriesResponse.data.list);
        setSelectedCategory(categoriesResponse.data.list[0].id.toString());
      }
    } catch {
      message.error('获取基础数据失败');
    }
  };

  const fetchCategories = async (languageId: string) => {
    const categoriesResponse = await getCorpusCategoriesByLanguage(languageId);
    if (categoriesResponse.data) {
      setCategories(categoriesResponse.data.list);
      setSelectedCategory(categoriesResponse.data.list[0].id.toString());
    }
  };

  const fetchWords = useCallback(async () => {
    if (!selectedLanguage || !selectedCategory) {
      return;
    }
    try {
      setLoading(true);
      const response = await getWordsByLanguageAndCategory(
        selectedLanguage,
        selectedCategory,
        {
          page: pagination.current,
          pageSize: pagination.pageSize
        }
      );
      setWords(response.data.list);
      setWordsCount(response.data.total);
    } catch {
      message.error('获取单词列表失败');
    } finally {
      setLoading(false);
    }
  }, [selectedLanguage, selectedCategory, pagination]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchWords();
  }, [pagination.pageSize, selectedLanguage, selectedCategory, fetchWords]);

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
    } catch {
      message.error('获取单词信息失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWord(id);
      message.success('删除成功');
      fetchWords();
    } catch {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingWord) {
        // 更新单词
        await updateWord(editingWord.id, values);
        message.success('更新成功');
        setModalVisible(false);
        fetchWords();
      } else {
        // 创建单词
        const createData: CreateWordDto = {
          word: values.word,
          meaning: values.meaning,
          meaningShort: values.meaningShort,
          example: values.example,
          transliteration: values.transliteration,
          usPhonetic: values.usPhonetic,
          ukPhonetic: values.ukPhonetic,
          audioUrl: values.audioUrl,
          imageUrl: values.imageUrl,
          languageId: values.languageId,
          categoryId: values.categoryId
        };

        await createWord(createData);
        message.success('创建成功');
        setModalVisible(false);
        fetchWords();
      }
    } catch {
      message.error('操作失败');
    }
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: '单词',
      dataIndex: 'word',
      key: 'word',
      render: (word: string) => (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{word}</span>
      )
    },
    {
      title: '翻译',
      dataIndex: 'meaning',
      key: 'meaning'
    },
    {
      title: '美式发音',
      dataIndex: 'ukPhonetic',
      key: 'ukPhonetic',
      render: (ukPhonetic: string, record: Word) => (
        <Space>
          <span>{ukPhonetic}</span>
          <Button
            type='link'
            size='small'
            icon={<SoundOutlined />}
            onClick={() => {
              playWordAudio(record);
            }}
          />
        </Space>
      )
    },
    {
      title: '英式发音',
      dataIndex: 'usPhonetic',
      key: 'usPhonetic',
      render: (usPhonetic: string, record: Word) => (
        <Space>
          <span>{usPhonetic}</span>
          <Button
            type='link'
            size='small'
            icon={<SoundOutlined />}
            onClick={() => {
              playWordAudio(record);
            }}
          />
        </Space>
      )
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
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: any) => (
        <Tag color='green'>{category?.name || '未知'}</Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Word) => (
        <Space size='middle'>
          <Button
            type='link'
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title='确定要删除这个单词吗？'
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
              title='总单词数'
              value={wordsCount}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='支持语言'
              value={languages.length}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='分类数量'
              value={categories?.length || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='当前页'
              value={words?.length || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
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
              placeholder='搜索单词...'
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              placeholder='选择语言'
              value={selectedLanguage}
              onChange={value => {
                setSelectedLanguage(value);
                fetchCategories(value);
              }}
              style={{ width: 150 }}
              allowClear>
              {languages.map(language => (
                <Select.Option key={language.id} value={language.id.toString()}>
                  {language.name}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder='选择分类'
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 150 }}
              allowClear>
              {categories.map(category => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Space>
          <Button type='primary' icon={<PlusOutlined />} onClick={handleCreate}>
            创建单词
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={words}
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
        />
      </Card>

      <Modal
        title={editingWord ? '编辑单词' : '创建单词'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}>
        <Form form={form} layout='vertical'>
          <Form.Item
            name='word'
            label='单词'
            rules={[{ required: true, message: '请输入单词' }]}>
            <Input placeholder='请输入单词' />
          </Form.Item>

          <Form.Item
            name='meaning'
            label='翻译'
            rules={[{ required: true, message: '请输入翻译' }]}>
            <Input.TextArea placeholder='请输入翻译' rows={3} />
          </Form.Item>
          <Form.Item
            name='meaningShort'
            label='短翻译'
            rules={[{ required: true, message: '请输入短翻译' }]}>
            <Input.TextArea placeholder='请输入短翻译' rows={2} />
          </Form.Item>

          <Form.Item
            name='usPhonetic'
            label='美式发音'
            rules={[{ required: true, message: '请输入发音' }]}>
            <Input placeholder='请输入美式发音，如：/ˈhæpi/' />
          </Form.Item>

          <Form.Item
            name='ukPhonetic'
            label='英式发音'
            rules={[{ required: true, message: '请输入英式发音' }]}>
            <Input placeholder='请输入英式发音，如：/ˈhæpi/' />
          </Form.Item>

          <Form.Item
            name='languageId'
            label='所属语言'
            rules={[{ required: true, message: '请选择语言' }]}>
            <Select placeholder='请选择语言'>
              {languages.map(language => (
                <Select.Option key={language.id} value={language.id}>
                  {language.name} ({language.code})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name='categoryId'
            label='所属分类'
            rules={[{ required: true, message: '请选择分类' }]}>
            <Select placeholder='请选择分类'>
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
