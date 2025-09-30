'use client';
import React from 'react';
import { Form, Switch, Space, Row, Col, Divider } from 'antd';
import { UserSettings } from '@/types';
import ShortcutButton from './ShortcutButton';

interface ShortcutSettingsProps {
  settings: UserSettings | undefined;
  listeningKey: string | null;
  pressedModifiers: string[];
  onToggleListening: (keyName?: string) => void;
  checkShortcutConflict: (
    shortcut: { key: string; modifiers: string[] },
    excludeKeyName?: string
  ) => { hasConflict: boolean; conflictWith?: string };
}

export default function ShortcutSettings({
  settings,
  listeningKey,
  pressedModifiers,
  onToggleListening,
  checkShortcutConflict
}: ShortcutSettingsProps) {
  return (
    <div className='bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-all duration-300 p-8'>
      <div className='mb-8'>
        <Space>
          <span className='text-white font-semibold text-lg'>快捷键设置</span>
        </Space>
      </div>

      <Form.Item
        label={
          <Space>
            <span className='text-gray-200 font-medium'>显示快捷键提示</span>
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
                <span className='text-gray-200 font-medium'>重置练习</span>
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
              listeningKey={listeningKey}
              pressedModifiers={pressedModifiers}
              onToggleListening={onToggleListening}
              checkShortcutConflict={checkShortcutConflict}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            label={
              <Space>
                <span className='text-gray-200 font-medium'>切换提示</span>
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
              listeningKey={listeningKey}
              pressedModifiers={pressedModifiers}
              onToggleListening={onToggleListening}
              checkShortcutConflict={checkShortcutConflict}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            label={
              <Space>
                <span className='text-gray-200 font-medium'>播放发音</span>
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
              listeningKey={listeningKey}
              pressedModifiers={pressedModifiers}
              onToggleListening={onToggleListening}
              checkShortcutConflict={checkShortcutConflict}
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
                <span className='text-gray-200 font-medium'>上一个单词</span>
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
              listeningKey={listeningKey}
              pressedModifiers={pressedModifiers}
              onToggleListening={onToggleListening}
              checkShortcutConflict={checkShortcutConflict}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label={
              <Space>
                <span className='text-gray-200 font-medium'>下一个单词</span>
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
              listeningKey={listeningKey}
              pressedModifiers={pressedModifiers}
              onToggleListening={onToggleListening}
              checkShortcutConflict={checkShortcutConflict}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
