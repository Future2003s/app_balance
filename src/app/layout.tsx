import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quản Lý Chi Tiêu",
  description: "Ứng dụng quản lý chi tiêu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Language" content="vi-VN" />
      </head>
      <body className="antialiased" suppressHydrationWarning lang="vi">
        {children}
      </body>
    </html>
  );
}

