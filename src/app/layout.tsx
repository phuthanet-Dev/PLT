import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PalangTas — พลังทาส ช่วยหาบ้านให้สัตว์เลี้ยง",
  description:
    "แพลตฟอร์มช่วยหาบ้านให้กับสัตว์เลี้ยง หาคู่ให้สัตว์ รวบรวมมูลนิธิสัตว์ และช่องทางการบริจาค",
  keywords: ["สัตว์เลี้ยง", "รับเลี้ยงสัตว์", "หาบ้านสัตว์", "บริจาค", "มูลนิธิสัตว์"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${inter.variable} ${notoSansThai.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
