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
import { getUserSettings, updateUserSettings, resetUserSettings } from '@/api';
import { UserSettings } from '@/types';
import { playWordAudio } from '@/hooks/useSpeech';
import { INITAIL_WORD } from '@/constant';

const { Option } = Select;

// 修饰键映射
const MODIFIER_MAP = {
  control: 'ctrl',
  meta: 'meta', // Mac 上 Meta 键（Command 键）
  alt: 'option', // Mac 上 Alt 对应 Option
  shift: 'shift',
  option: 'option'
} as const;

// 修饰键显示映射
const MODIFIER_DISPLAY = {
  ctrl: 'Ctrl',
  meta: '⌘', // Mac 上 Meta 键显示为 ⌘
  alt: 'Alt',
  shift: 'Shift',
  option: '⌥'
} as const;

export default function Custom() {
  const [form] = Form.useForm();
  const [settings, setSettings] = useState<UserSettings>();
  const [isLoading, setIsLoading] = useState(false);
  const [listeningKey, setListeningKey] = useState<string | null>(null);
  const [pressedModifiers, setPressedModifiers] = useState<string[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  // 加载用户设置
  const loadSettings = useCallback(async () => {
    try {
      const res = await getUserSettings();
      const userSettings = res.data.settings as UserSettings;
      setSettings(userSettings);
      form.setFieldsValue(userSettings);
    } catch {
      messageApi.error('加载设置失败');
    }
  }, [form, messageApi]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // 监听设置加载完成，初始化表单
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (settings && !isInitialized) {
      form.setFieldsValue(settings);
      setIsInitialized(true);
    }
  }, [settings, form, isInitialized]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await form.validateFields();
      const saveData = {
        ...form.getFieldsValue(),
        shortcuts: settings?.shortcuts
      };

      updateUserSettings(saveData).then(res => {
        if (res.code === 200) {
          const newSettings = res.data.settings as UserSettings;
          setSettings(newSettings);

          messageApi.success('设置保存成功！');
        } else {
          messageApi.error(res.message);
        }
      });
    } catch {
      messageApi.error('保存设置失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      resetUserSettings().then(res => {
        if (res.code === 200) {
          const newSettings = res.data.settings as UserSettings;
          setSettings(newSettings);
          form.setFieldsValue(newSettings); // 直接更新表单值
          messageApi.success('设置已重置为默认值');
        } else {
          messageApi.error(res.message);
        }
      });
    } catch {
      messageApi.error('重置设置失败');
    }
  };

  // 快捷键监听控制
  const toggleListening = (keyName?: string) => {
    if (listeningKey === keyName) {
      setListeningKey(null);
      setPressedModifiers([]);
    } else if (keyName) {
      setListeningKey(keyName);
      setPressedModifiers([]);
    }
  };

  // 检测快捷键冲突
  const checkShortcutConflict = useCallback(
    (
      newShortcut: { key: string; modifiers: string[] },
      excludeKeyName?: string
    ): { hasConflict: boolean; conflictWith?: string } => {
      if (!settings?.shortcuts) return { hasConflict: false };

      const shortcutEntries = [
        { name: 'resetExercise', shortcut: settings.shortcuts.resetExercise },
        { name: 'toggleHint', shortcut: settings.shortcuts.toggleHint },
        { name: 'pronunciation', shortcut: settings.shortcuts.pronunciation },
        {
          name: 'wordNavigationPrev',
          shortcut: settings.shortcuts.wordNavigation.prev
        },
        {
          name: 'wordNavigationNext',
          shortcut: settings.shortcuts.wordNavigation.next
        }
      ];

      for (const { name, shortcut } of shortcutEntries) {
        if (name === excludeKeyName) continue;

        if (
          shortcut.key === newShortcut.key &&
          JSON.stringify(shortcut.modifiers.sort()) ===
            JSON.stringify(newShortcut.modifiers.sort())
        ) {
          return { hasConflict: true, conflictWith: name };
        }
      }

      return { hasConflict: false };
    },
    [settings]
  );

  // 处理按键按下事件
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!listeningKey) return;
      e.preventDefault();
      e.stopPropagation();

      // 检查是否是修饰键
      const isModifier = ['Control', 'Meta', 'Alt', 'Shift', 'Option'].includes(
        e.key
      );

      if (isModifier) {
        const modifier =
          MODIFIER_MAP[e.key.toLowerCase() as keyof typeof MODIFIER_MAP];
        if (modifier) {
          setPressedModifiers(prev =>
            prev.includes(modifier) ? prev : [...prev, modifier]
          );
        }
        return;
      }

      // 处理主键按下
      let mainKey = e.key.toLowerCase();

      // 在 Mac 上，Option + 其他键会产生特殊字符，使用 code 属性
      if (pressedModifiers.includes('option')) {
        const keyCode = e.code;
        if (keyCode.startsWith('Key')) {
          mainKey = keyCode.replace('Key', '').toLowerCase();
        } else if (keyCode.startsWith('Digit')) {
          mainKey = keyCode.replace('Digit', '');
        } else if (keyCode.startsWith('Arrow')) {
          mainKey = keyCode.replace('Arrow', '').toLowerCase();
        } else {
          const specialKeys: Record<string, string> = {
            Space: 'space',
            Enter: 'enter',
            Escape: 'escape'
          };
          mainKey = specialKeys[keyCode] || e.key.toLowerCase();
        }
      }
      // 更新设置
      if (!settings?.shortcuts) return;

      const shortcutConfig = { key: mainKey, modifiers: [...pressedModifiers] };

      // 检查快捷键冲突
      const conflictCheck = checkShortcutConflict(shortcutConfig, listeningKey);
      if (conflictCheck.hasConflict) {
        const conflictNames: Record<string, string> = {
          resetExercise: '重置练习',
          toggleHint: '切换提示',
          pronunciation: '播放发音',
          wordNavigationPrev: '上一个单词',
          wordNavigationNext: '下一个单词'
        };

        const conflictDisplayName =
          conflictNames[conflictCheck.conflictWith!] ||
          conflictCheck.conflictWith;
        messageApi.error(
          `快捷键冲突！该快捷键已被 "${conflictDisplayName}" 使用，请选择其他快捷键。`
        );
        setListeningKey(null);
        setPressedModifiers([]);
        return;
      }

      const newSettings = { ...settings };

      // 快捷键映射
      const shortcutMap: Record<
        string,
        (config: typeof shortcutConfig) => void
      > = {
        resetExercise: config => {
          newSettings.shortcuts.resetExercise = config;
        },
        toggleHint: config => {
          newSettings.shortcuts.toggleHint = config;
        },
        pronunciation: config => {
          newSettings.shortcuts.pronunciation = config;
        },
        wordNavigationPrev: config => {
          newSettings.shortcuts.wordNavigation.prev = config;
        },
        wordNavigationNext: config => {
          newSettings.shortcuts.wordNavigation.next = config;
        }
      };

      shortcutMap[listeningKey]?.(shortcutConfig);

      setSettings(newSettings as UserSettings);
      form.setFieldsValue(newSettings);

      // 显示快捷键
      const modifierText =
        pressedModifiers.length > 0
          ? pressedModifiers
              .map(
                m => MODIFIER_DISPLAY[m as keyof typeof MODIFIER_DISPLAY] || m
              )
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
    [
      listeningKey,
      settings,
      pressedModifiers,
      form,
      messageApi,
      checkShortcutConflict
    ]
  );

  // 处理按键释放事件
  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (!listeningKey) return;

      const isModifier = ['Control', 'Meta', 'Alt', 'Shift', 'Option'].includes(
        e.key
      );
      if (isModifier) {
        const modifier =
          MODIFIER_MAP[e.key.toLowerCase() as keyof typeof MODIFIER_MAP];
        if (modifier) {
          setPressedModifiers(prev => prev.filter(m => m !== modifier));
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
            .map(m => MODIFIER_DISPLAY[m as keyof typeof MODIFIER_DISPLAY] || m)
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

    // 检查当前快捷键是否与其他快捷键冲突
    const hasConflict =
      currentShortcut.key &&
      checkShortcutConflict(currentShortcut, keyName).hasConflict;

    return (
      <div className='flex flex-col space-y-3'>
        <Button
          type={isListening ? 'primary' : 'dashed'}
          onClick={() => toggleListening(keyName)}
          className={`min-w-[180px] h-12 text-base font-medium transition-all duration-300 ${
            isListening
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40'
              : hasConflict
                ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-0 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40'
                : 'bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-white hover:text-gray-100 shadow-md hover:shadow-lg'
          }`}>
          {isListening
            ? `按住修饰键${pressedModifiers.length > 0 ? pressedModifiers.join(' + ') + ' + ' : ''}`
            : formatShortcut(currentShortcut)}
        </Button>
        {hasConflict && (
          <div className='text-red-400 text-sm text-center'>⚠️ 快捷键冲突</div>
        )}
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
                    onChange={value => {
                      setSettings(prev =>
                        prev
                          ? { ...prev, autoPlayPronunciation: value }
                          : undefined
                      );
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[32, 24]} className='flex items-end'>
              <Col xs={24} md={12}>
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
                    size='large'
                    onChange={value => {
                      playWordAudio(INITAIL_WORD, {
                        pronunciationVolume: 100,
                        typingSoundVolume: 100,
                        soundEnabled: true,
                        autoPlayPronunciation: true,
                        voiceType: value
                      } as UserSettings);
                    }}>
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
                      value={settings?.pronunciationVolume}
                      onChange={value => {
                        setSettings(prev =>
                          prev
                            ? { ...prev, pronunciationVolume: value }
                            : undefined
                        );
                        form.setFieldsValue({
                          pronunciationVolume: value
                        });
                      }}
                    />
                  </div>
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
                      <KeyOutlined className='text-purple-400' />
                      <span className='text-gray-200 font-medium'>
                        键盘音效音量
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
                      value={settings?.typingSoundVolume}
                      onChange={value => {
                        setSettings(prev =>
                          prev
                            ? { ...prev, typingSoundVolume: value }
                            : undefined
                        );
                        form.setFieldsValue({
                          typingSoundVolume: value
                        });
                      }}
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
                    currentShortcut={
                      settings?.shortcuts.resetExercise || {
                        key: '',
                        modifiers: []
                      }
                    }
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
                    currentShortcut={
                      settings?.shortcuts.toggleHint || {
                        key: '',
                        modifiers: []
                      }
                    }
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
                    currentShortcut={
                      settings?.shortcuts.pronunciation || {
                        key: '',
                        modifiers: []
                      }
                    }
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
                    currentShortcut={
                      settings?.shortcuts.wordNavigation.prev || {
                        key: '',
                        modifiers: []
                      }
                    }
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
                    currentShortcut={
                      settings?.shortcuts.wordNavigation.next || {
                        key: '',
                        modifiers: []
                      }
                    }
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
