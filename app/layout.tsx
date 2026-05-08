import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Menggunakan Inter sebagai font utama sesuai preferensi desainmu
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Numetrix | Kalkulator Metode Numerik",
  description:
    "Platform eksperimen metode numerik untuk solusi SPL dan matriks dengan pendekatan presisi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full scroll-smooth",
        inter.variable,
        "font-sans antialiased",
      )}
    >
      <body className="min-h-full bg-[#f2f2f2] text-black flex flex-col">
        {children}
      </body>
    </html>
  );
}
