import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ConfigProvider } from 'antd';
import { GameModeProvider } from '@/contexts/GameModeContext';
import Footer from '@/components/Footer/Footer';
import '@ant-design/v5-patch-for-react-19';
import '@/assets/styles/global.css';
import { getAntdTheme } from '@typing/theme';

const freaoka = localFont({
  src: '../assets/font/freaoka.ttf',
  display: 'swap'
});

export const metadata: Metadata = {
  title: '拼写鸭',
  description: '高效英语学习平台，让语言学习变得简单有趣'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`bg-slate-950 overflow-x-hidden ${freaoka.className}`}>
        <ConfigProvider theme={getAntdTheme()}>
          <div className='min-h-screen flex flex-col'>
            <GameModeProvider>{children}</GameModeProvider>
            <Footer />
          </div>
        </ConfigProvider>
      </body>
    </html>
  );
}
