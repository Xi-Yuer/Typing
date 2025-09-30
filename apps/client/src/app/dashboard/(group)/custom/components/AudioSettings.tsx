'use client';
import React from 'react';
import { Form, Select, Slider, Switch, Space, Row, Col } from 'antd';
import { SoundOutlined, AudioOutlined, KeyOutlined } from '@ant-design/icons';
import { UserSettings } from '@/types';
import { playWordAudio } from '@/hooks/useSpeech';
import { INITAIL_WORD } from '@/constant';

const { Option } = Select;

interface AudioSettingsProps {
  settings: UserSettings | undefined;
  onSettingsChange: (settings: UserSettings) => void;
  form: any;
}

export default function AudioSettings({
  settings,
  onSettingsChange,
  form
}: AudioSettingsProps) {
  return (
    <div className='bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-all duration-300 p-8'>
      <div className='mb-8'>
        <Space>
          <span className='text-white font-semibold text-lg'>音频设置</span>
        </Space>
      </div>

      <Row>
        <Col xs={24} md={24}>
          <Form.Item
            label={
              <Space>
                <span className='text-gray-200 font-medium'>自动播放发音</span>
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
                onSettingsChange({
                  ...settings!,
                  autoPlayPronunciation: value
                });
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
                <span className='text-gray-200 font-medium'>发音音色</span>
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
                <span className='text-gray-200 font-medium'>发音音量</span>
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
                  onSettingsChange({
                    ...settings!,
                    pronunciationVolume: value
                  });
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
                <span className='text-gray-200 font-medium'>启用音效</span>
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
                <span className='text-gray-200 font-medium'>键盘音效音量</span>
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
                  onSettingsChange({
                    ...settings!,
                    typingSoundVolume: value
                  });
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
  );
}
