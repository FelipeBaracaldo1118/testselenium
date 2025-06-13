import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Subject Management System',
  description: 'A comprehensive CRUD application for managing academic subjects and courses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="csrf-token" content="your-csrf-token-here" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}