import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '도쿄 여행 일정 생성기',
  description:
    '여행 기간과 목적을 입력하면 맞춤형 도쿄 여행 일정을 생성해 드립니다.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={geist.className}>
      <body>{children}</body>
    </html>
  );
}
