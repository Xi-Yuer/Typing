'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Form,
  Select,
  Slider,
  Switch,
  Button,
  Space,
  Divider,
  Row,
  Col,
  message
} from 'antd';
import {
  SoundOutlined,
  KeyOutlined,
  AudioOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';

const { Option } = Select;

interface CustomSettings {
  voiceType: '0' | '1';
  pronunciationVolume: number;
  typingSoundVolume: number;
  soundEnabled: boolean;
  resetExercise: {
    key: string;
    modifiers: string[];
  };
  toggleHint: {
    key: string;
    modifiers: string[];
  };
  pronunciation: {
    key: string;
    modifiers: string[];
  };
  wordNavigation: {
    prev: {
      key: string;
      modifiers: string[];
    };
    next: {
      key: string;
      modifiers: string[];
    };
  };
  autoPlayPronunciation: boolean;
  showShortcutHints: boolean;
}

const defaultSettings: CustomSettings = {
  voiceType: '1',
  pronunciationVolume: 100,
  typingSoundVolume: 100,
  soundEnabled: true,
  resetExercise: {
    key: 'r',
    modifiers: ['ctrl']
  },
  toggleHint: {
    key: 'h',
    modifiers: ['ctrl']
  },
  pronunciation: {
    key: 'p',
    modifiers: ['ctrl']
  },
  wordNavigation: {
    prev: {
      key: 'arrowleft',
      modifiers: ['ctrl']
    },
    next: {
      key: 'arrowright',
      modifiers: ['ctrl']
    }
  },
  autoPlayPronunciation: true,
  showShortcutHints: true
};

export default function Custom() {
  const [form] = Form.useForm();
  const [settings, setSettings] = useState<CustomSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [listeningKey, setListeningKey] = useState<string | null>(null);
  const [pressedModifiers, setPressedModifiers] = useState<string[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();

      const newSettings = { ...settings, ...values };
      setSettings(newSettings);

      messageApi.success('设置保存成功！');
    } catch {
      messageApi.error('保存设置失败，请检查输入');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    form.setFieldsValue(defaultSettings);
    messageApi.success('设置已重置为默认值');
  };

  // 开始监听按键
  const startListening = (keyName: string) => {
    setListeningKey(keyName);
    setPressedModifiers([]);
  };

  // 停止监听按键
  const stopListening = () => {
    setListeningKey(null);
    setPressedModifiers([]);
  };

  // 处理按键按下事件
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!listeningKey) return;
      e.preventDefault();
      e.stopPropagation();

      // 检查是否是修饰键
      const isModifier = [
        'Control',
        'Meta',
        'Alt',
        'Shift',
        'Option',
        'Command'
      ].includes(e.key);

      if (isModifier) {
        // 处理修饰键按下
        const modifier = e.key.toLowerCase();
        if (modifier === 'control') {
          setPressedModifiers(prev =>
            prev.includes('ctrl') ? prev : [...prev, 'ctrl']
          );
        } else if (modifier === 'meta') {
          setPressedModifiers(prev =>
            prev.includes('meta') ? prev : [...prev, 'meta']
          );
        } else if (modifier === 'alt') {
          setPressedModifiers(prev =>
            prev.includes('alt') ? prev : [...prev, 'alt']
          );
        } else if (modifier === 'shift') {
          setPressedModifiers(prev =>
            prev.includes('shift') ? prev : [...prev, 'shift']
          );
        } else if (modifier === 'option') {
          setPressedModifiers(prev =>
            prev.includes('option') ? prev : [...prev, 'option']
          );
        } else if (modifier === 'command') {
          setPressedModifiers(prev =>
            prev.includes('command') ? prev : [...prev, 'command']
          );
        }
        return;
      }

      // 处理主键按下
      const mainKey = e.key.toLowerCase();
      // 更新设置
      const newSettings = { ...settings };
      const shortcutConfig = {
        key: mainKey,
        modifiers: [...pressedModifiers]
      };

      if (listeningKey === 'resetExercise') {
        newSettings.resetExercise = shortcutConfig;
      } else if (listeningKey === 'toggleHint') {
        newSettings.toggleHint = shortcutConfig;
      } else if (listeningKey === 'pronunciation') {
        newSettings.pronunciation = shortcutConfig;
      } else if (listeningKey === 'wordNavigationPrev') {
        newSettings.wordNavigation.prev = shortcutConfig;
      } else if (listeningKey === 'wordNavigationNext') {
        newSettings.wordNavigation.next = shortcutConfig;
      }

      setSettings(newSettings);
      form.setFieldsValue(newSettings);

      // 显示快捷键
      const modifierText =
        pressedModifiers.length > 0
          ? pressedModifiers
              .map(m => {
                switch (m) {
                  case 'ctrl':
                    return 'Ctrl';
                  case 'meta':
                    return '⌘';
                  case 'alt':
                    return 'Alt';
                  case 'shift':
                    return 'Shift';
                  case 'option':
                    return 'Option';
                  case 'command':
                    return '⌘';
                  default:
                    return m;
                }
              })
              .join(' + ') + ' + '
          : '';

      const keyText =
        mainKey === 'space'
          ? 'Space'
          : mainKey.startsWith('arrow')
            ? mainKey.replace('arrow', '')
            : mainKey.startsWith('f')
              ? mainKey.toUpperCase()
              : mainKey.toUpperCase();

      messageApi.success(`快捷键已设置为: ${modifierText}${keyText}`);
      setListeningKey(null);
      setPressedModifiers([]);
    },
    [listeningKey, settings, pressedModifiers, form, messageApi]
  );

  // 处理按键释放事件
  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (!listeningKey) return;

      // 检查是否是修饰键释放
      const isModifier = [
        'Control',
        'Meta',
        'Alt',
        'Shift',
        'Option',
        'Command'
      ].includes(e.key);

      if (isModifier) {
        const modifier = e.key.toLowerCase();
        if (modifier === 'control') {
          setPressedModifiers(prev => prev.filter(m => m !== 'ctrl'));
        } else if (modifier === 'meta') {
          setPressedModifiers(prev => prev.filter(m => m !== 'meta'));
        } else if (modifier === 'alt') {
          setPressedModifiers(prev => prev.filter(m => m !== 'alt'));
        } else if (modifier === 'shift') {
          setPressedModifiers(prev => prev.filter(m => m !== 'shift'));
        } else if (modifier === 'option') {
          setPressedModifiers(prev => prev.filter(m => m !== 'option'));
        } else if (modifier === 'command') {
          setPressedModifiers(prev => prev.filter(m => m !== 'command'));
        }
      }
    },
    [listeningKey]
  );

  // 监听全局按键事件
  useEffect(() => {
    if (listeningKey) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [listeningKey, handleKeyDown, handleKeyUp]);

  // 格式化快捷键显示
  const formatShortcut = (shortcut: { key: string; modifiers: string[] }) => {
    const modifierText =
      shortcut.modifiers.length > 0
        ? shortcut.modifiers
            .map(m => {
              switch (m) {
                case 'ctrl':
                  return 'Ctrl';
                case 'meta':
                  return '⌘';
                case 'alt':
                  return 'Alt';
                case 'shift':
                  return 'Shift';
                case 'option':
                  return 'Option';
                case 'command':
                  return 'Command';
                default:
                  return m;
              }
            })
            .join(' + ') + ' + '
        : '';

    const keyText =
      shortcut.key === 'space'
        ? 'Space'
        : shortcut.key.startsWith('arrow')
          ? shortcut.key.replace('arrow', '')
          : shortcut.key.startsWith('f')
            ? shortcut.key.toUpperCase()
            : shortcut.key.toUpperCase();

    return `${modifierText}${keyText}`;
  };

  // 快捷键显示组件
  const ShortcutButton = ({
    keyName,
    currentShortcut
  }: {
    keyName: string;
    currentShortcut: { key: string; modifiers: string[] };
  }) => {
    const isListening = listeningKey === keyName;

    return (
      <div className='flex flex-col space-y-3'>
        <Button
          type={isListening ? 'primary' : 'dashed'}
          onClick={() =>
            isListening ? stopListening() : startListening(keyName)
          }
          className={`min-w-[180px] h-12 text-base font-medium transition-all duration-300 ${
            isListening
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40'
              : 'bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-white hover:text-gray-100 shadow-md hover:shadow-lg'
          }`}>
          {isListening
            ? `按住修饰键${pressedModifiers.length > 0 ? pressedModifiers.join(' + ') + ' + ' : ''}`
            : formatShortcut(currentShortcut)}
        </Button>
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6'>
      {contextHolder}
      <div className='max-w-5xl mx-auto'>
        <Form
          form={form}
          layout='vertical'
          className='space-y-12'
          initialValues={settings}>
          {/* 音频设置 */}
          <div className='bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-all duration-300 p-8'>
            <div className='mb-8'>
              <Space>
                <span className='text-white font-semibold text-lg'>
                  音频设置
                </span>
              </Space>
            </div>
            <Row>
              <Col xs={24} md={24}>
                <Form.Item
                  label={
                    <Space>
                      <span className='text-gray-200 font-medium'>
                        自动播放发音
                      </span>
                    </Space>
                  }
                  name='autoPlayPronunciation'
                  valuePropName='checked'>
                  <Switch
                    checkedChildren='开启'
                    unCheckedChildren='关闭'
                    className='bg-slate-700'
                    size='default'
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24}>
                <Form.Item
                  label={
                    <Space>
                      <span className='text-gray-200 font-medium'>
                        发音音色
                      </span>
                    </Space>
                  }
                  name='voiceType'>
                  <Select
                    className='bg-slate-800/50 border-slate-600 hover:border-purple-500 transition-colors'
                    placeholder='选择发音音色'
                    suffixIcon={<SoundOutlined className='text-purple-400' />}
                    size='large'>
                    <Option value='0'>
                      <Space>
                        <span className='font-medium'>女声</span>
                      </Space>
                    </Option>
                    <Option value='1'>
                      <Space>
                        <span className='font-medium'>男声</span>
                      </Space>
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[32, 24]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <span className='text-gray-200 font-medium'>
                        启用音效
                      </span>
                    </Space>
                  }
                  name='soundEnabled'
                  valuePropName='checked'>
                  <Switch
                    checkedChildren='开启'
                    unCheckedChildren='关闭'
                    className='bg-slate-700'
                    size='default'
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[32, 24]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <AudioOutlined className='text-purple-400' />
                      <span className='text-gray-200 font-medium'>
                        发音音量
                      </span>
                    </Space>
                  }
                  name='pronunciationVolume'>
                  <div className='px-2'>
                    <Slider
                      min={0}
                      max={100}
                      className='slider-purple'
                      tooltip={{ placement: 'top' }}
                      defaultValue={settings.pronunciationVolume}
                    />
                  </div>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <KeyOutlined className='text-purple-400' />
                      <span className='text-gray-200 font-medium'>
                        打字音效音量
                      </span>
                    </Space>
                  }
                  name='typingSoundVolume'>
                  <div className='px-2'>
                    <Slider
                      min={0}
                      max={100}
                      className='slider-purple'
                      tooltip={{ placement: 'top' }}
                      defaultValue={settings.typingSoundVolume}
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 快捷键设置 */}
          <div className='bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-all duration-300 p-8'>
            <div className='mb-8'>
              <Space>
                <span className='text-white font-semibold text-lg'>
                  快捷键设置
                </span>
              </Space>
            </div>
            <Form.Item
              label={
                <Space>
                  <span className='text-gray-200 font-medium'>
                    显示快捷键提示
                  </span>
                </Space>
              }
              name='showShortcutHints'
              valuePropName='checked'>
              <Switch
                checkedChildren='显示'
                unCheckedChildren='隐藏'
                className='bg-slate-700'
                size='default'
              />
            </Form.Item>
            <Row gutter={[24, 20]}>
              <Col xs={24} md={8}>
                <Form.Item
                  label={
                    <Space>
                      <span className='text-gray-200 font-medium'>
                        重置练习
                      </span>
                    </Space>
                  }>
                  <ShortcutButton
                    keyName='resetExercise'
                    currentShortcut={settings.resetExercise}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label={
                    <Space>
                      <span className='text-gray-200 font-medium'>
                        切换提示
                      </span>
                    </Space>
                  }>
                  <ShortcutButton
                    keyName='toggleHint'
                    currentShortcut={settings.toggleHint}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label={
                    <Space>
                      <span className='text-gray-200 font-medium'>
                        播放发音
                      </span>
                    </Space>
                  }>
                  <ShortcutButton
                    keyName='pronunciation'
                    currentShortcut={settings.pronunciation}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider
              className='border-purple-500 my-6'
              style={{ borderColor: '#732cc550' }}
            />

            <Row gutter={[24, 20]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <span className='text-gray-200 font-medium'>
                        上一个单词
                      </span>
                    </Space>
                  }>
                  <ShortcutButton
                    keyName='wordNavigationPrev'
                    currentShortcut={settings.wordNavigation.prev}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <span className='text-gray-200 font-medium'>
                        下一个单词
                      </span>
                    </Space>
                  }>
                  <ShortcutButton
                    keyName='wordNavigationNext'
                    currentShortcut={settings.wordNavigation.next}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 操作按钮 */}
          <Row justify='center' gutter={24} className='mt-10'>
            <Col>
              <Button
                type='primary'
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={isLoading}
                size='large'
                className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 h-12 px-8 text-lg font-medium'>
                保存设置
              </Button>
            </Col>
            <Col>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                size='large'
                className='bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-white hover:text-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-8 text-lg font-medium'>
                重置默认
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
