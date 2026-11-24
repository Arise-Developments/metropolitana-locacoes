import type { Metadata, Viewport } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { site } from "@/config/site";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", weight: ["600", "700", "800"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Aluguel de carros`, template: `%s | ${site.name}` },
  description: site.description,
  icons: { icon: "/favicon.svg" },
  openGraph: { type: "website", locale: "pt_BR", siteName: site.name, title: site.name, description: site.description },
};

export const viewport: Viewport = { themeColor: "#071630" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${manrope.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-white focus:p-3">
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo" className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
