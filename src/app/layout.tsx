import type { Metadata } from "next";
import { Manrope, Noto_Sans_Bengali } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AuthProvider } from "@/context/auth-context";
import { ShopProvider } from "@/context/shop-context";
import "@/app/globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
});

export const metadata: Metadata = {
  title: "LUMES BD | Light Up Your Style",
  description: "Premium Jerseys & Modern Fashion Wear for Men & Women. Quality, Comfort, Trend. Delivery all over Bangladesh.",
  keywords: ["jerseys", "fashion", "clothing", "Bangladesh", "LUMES BD", "premium wear", "men", "women"],
  metadataBase: new URL("https://lumesbd.shop"),
  alternates: {
    canonical: "https://lumesbd.shop",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon.png",
        type: "image/png",
        sizes: "any",
      },
    ],
    shortcut: "/favicon.png",
    apple: "/lumes-logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "LUMES BD | Light Up Your Style",
    description: "Premium Jerseys & Modern Fashion Wear for Men & Women. Quality, Comfort, Trend. Delivery all over Bangladesh.",
    url: "https://lumesbd.shop",
    siteName: "LUMES BD",
    type: "website",
    locale: "en_BD",
    images: [
      {
        url: "https://lumesbd.shop/lumes-logo.png",
        width: 512,
        height: 512,
        alt: "LUMES BD logo",
        type: "image/png",
      },
      {
        url: "https://lumesbd.shop/icon.png",
        width: 512,
        height: 512,
        alt: "LUMES BD icon",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LUMES BD | Light Up Your Style",
    description: "Premium Jerseys & Modern Fashion Wear for Men & Women. Quality, Comfort, Trend. Delivery all over Bangladesh.",
    images: {
      url: "https://lumesbd.shop/lumes-logo.png",
      alt: "LUMES BD logo",
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${notoSansBengali.variable} bg-[#060c24] text-white antialiased`}>
        <AuthProvider>
          <ShopProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
