'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Form, message } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import { getUserSettings, updateUserSettings, resetUserSettings } from '@/api';
import { UserSettings } from '@/types';
import AudioSettings from './components/AudioSettings';
import ShortcutSettings from './components/ShortcutSettings';
import ActionButtons from './components/ActionButtons';

// 修饰键映射
const MODIFIER_MAP = {
  control: 'ctrl',
  meta: 'meta', // Mac 上 Meta 键（Command 键）
  alt: 'option', // Mac 上 Alt 对应 Option
  shift: 'shift',
  option: 'option'
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
      const MODIFIER_DISPLAY = {
        ctrl: 'Ctrl',
        meta: '⌘',
        alt: 'Alt',
        shift: 'Shift',
        option: '⌥'
      } as const;

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

  // 处理设置变更
  const handleSettingsChange = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  return (
    <div className='bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6'>
      {contextHolder}
      <div className='max-w-5xl mx-auto'>
        <Form
          form={form}
          layout='vertical'
          className='space-y-12'
          initialValues={settings}>
          {/* 音频设置 */}
          <AudioSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            form={form}
          />

          {/* 快捷键设置 */}
          <ShortcutSettings
            settings={settings}
            listeningKey={listeningKey}
            pressedModifiers={pressedModifiers}
            onToggleListening={toggleListening}
            checkShortcutConflict={checkShortcutConflict}
          />

          {/* 操作按钮 */}
          <ActionButtons
            onSave={handleSave}
            onReset={handleReset}
            isLoading={isLoading}
          />
        </Form>
      </div>
    </div>
  );
}
