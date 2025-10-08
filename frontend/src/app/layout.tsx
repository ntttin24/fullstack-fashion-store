import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";
import MiniToast from "@/components/MiniToast";
import Cart from "@/components/Cart";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FashionStore - Thời trang hiện đại",
  description: "Khám phá bộ sưu tập thời trang mới nhất với chất lượng cao và giá cả hợp lý",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans antialiased bg-[var(--background)] text-[var(--foreground)]`}>
        <ConditionalHeader />
        <main className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] transition-[background-color,color] duration-200 ease-linear">{children}</main>
        <Cart />
        <MiniToast />
      </body>
    </html>
  );
}
