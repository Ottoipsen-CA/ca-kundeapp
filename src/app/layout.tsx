import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { AppDataProvider } from "@/lib/store";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Copenhagen Academy",
  description: "Medlemsapp for Copenhagen Academy — privat fodboldudvikling i København",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="da"
      className={`${barlow.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-canvas text-text">
        <AppDataProvider>{children}</AppDataProvider>
      </body>
    </html>
  );
}
