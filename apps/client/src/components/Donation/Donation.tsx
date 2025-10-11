'use client';
import React from 'react';
import { Popover, Button } from 'antd';
import { WechatOutlined, AlipayOutlined } from '@ant-design/icons';
import AlipayQR from '@/assets/images/nodation/ailipay.png';
import WechatQR from '@/assets/images/nodation/wechat.png';

interface QRCodePopoverProps {
  src: string;
  alt: string;
  title: string;
  icon: React.ReactNode;
  buttonText: string;
}

const QRCodePopover: React.FC<QRCodePopoverProps> = ({
  src,
  alt,
  title,
  icon,
  buttonText
}) => {
  const content = (
    <div className='text-center p-4'>
      <img
        src={src}
        alt={alt}
        className='w-40 h-40 object-cover rounded-lg mx-auto'
      />
      <p className='text-sm text-white mt-3'>{title}</p>
    </div>
  );

  return (
    <Popover
      content={content}
      title={title}
      trigger='hover'
      placement='top'
      align={{
        offset: [0, 8]
      }}>
      <Button
        type='primary'
        icon={icon}
        className='bg-slate-700 border-slate-600 hover:bg-slate-600 text-white'>
        {buttonText}
      </Button>
    </Popover>
  );
};

const Donation: React.FC = () => {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-white'>支持我们</h3>
      <p className='text-slate-400 text-sm mb-4'>
        如果这个项目对您有帮助，欢迎打赏支持！
      </p>
      <div className='flex space-x-3'>
        {/* 微信收款码 */}
        <QRCodePopover
          src={WechatQR.src}
          alt='微信收款码'
          title='微信支付'
          icon={<WechatOutlined />}
          buttonText='微信'
        />

        {/* 支付宝收款码 */}
        <QRCodePopover
          src={AlipayQR.src}
          alt='支付宝收款码'
          title='支付宝'
          icon={<AlipayOutlined />}
          buttonText='支付宝'
        />
      </div>
    </div>
  );
};

export default Donation;
