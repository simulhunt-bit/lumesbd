import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AuthProvider } from "@/context/auth-context";
import { ShopProvider } from "@/context/shop-context";
import { buildMetadata, keywords, siteUrl } from "@/lib/seo";
import "@/app/globals.css";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "LUMES BD | Premium Jersey Shop Bangladesh",
    description: "Buy premium football jerseys, original copy kits, and fanwear online from LUMES BD with fast delivery across Bangladesh.",
    path: "/",
    pageKeywords: keywords([
      "LUMES BD official store",
      "premium jerseys Bangladesh",
      "modern fashion wear Bangladesh",
      "football jersey online BD",
      "jersey delivery Bangladesh",
      "buy premium jersey Bangladesh",
      "football jersey shop Dhaka",
      "original copy football jersey BD",
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
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "LUMES BD",
    url: siteUrl,
    logo: `${siteUrl}/lumes-logo.png`,
    image: `${siteUrl}/lumes-logo.png`,
    description: "Premium football jerseys, original copy kits, flag jerseys, and fanwear with delivery across Bangladesh.",
    areaServed: {
      "@type": "Country",
      name: "Bangladesh",
    },
    sameAs: [siteUrl],
  };

  return (
    <html lang="en">
      <head>
        <meta name="facebook-domain-verification" content="c7p891ql860jbqslteujakhzrt17bp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
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
