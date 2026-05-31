import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AuthProvider } from "@/context/auth-context";
import { ShopProvider } from "@/context/shop-context";
import { buildMetadata, keywords, siteUrl } from "@/lib/seo";
import "@/app/globals.css";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "LUMES BD | Light Up Your Style",
    description: "Premium jerseys and modern fashion wear for men and women with delivery across Bangladesh.",
    path: "/",
    pageKeywords: keywords([
      "LUMES BD official store",
      "premium jerseys Bangladesh",
      "modern fashion wear Bangladesh",
      "football jersey online BD",
      "jersey delivery Bangladesh",
    ]),
  }),
  metadataBase: new URL(siteUrl),
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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-[#060c24] text-white antialiased">
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
