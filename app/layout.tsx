import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { PageTransition } from "@/components/layout/page-transition";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DelightStore - Smart Watches, Gadgets, Speakers & Mobile Accessories",
    template: "%s | DelightStore",
  },
  description: "Shop the latest smart watches, gadgets, speakers, and mobile accessories at DelightStore.tz.com. Your trusted tech store in Tanzania.",
  keywords: ["smart watches", "gadgets", "speakers", "mobile accessories", "Tanzania", "e-commerce"],
  authors: [{ name: "DelightStore" }],
  icons: {
    icon: "/logo/favicon.png",
    shortcut: "/logo/favicon.png",
    apple: "/logo/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.delightstore.tz.com",
    siteName: "DelightStore",
    title: "DelightStore - Smart Watches, Gadgets, Speakers & Mobile Accessories",
    description: "Shop the latest smart watches, gadgets, speakers, and mobile accessories at DelightStore.tz.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <Providers>
          <PageTransition>{children}</PageTransition>
          <Toaster position="top-right" />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
