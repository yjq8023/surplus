import type { Metadata } from "next";
import localFont from "next/font/local";
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/locale/zh_CN';
import "./globals.css";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "盈余",
  description: "盈余账本",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  dayjs.locale('zh-cn');
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ConfigProvider locale={zh_CN}>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
