import type { Metadata } from "next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AuthProvider } from "@/context/auth-context";
import { ShopProvider } from "@/context/shop-context";
import { buildMetadata, keywords, siteUrl } from "@/lib/seo";
import "@/app/globals.css";

const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "2417781878727667";

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
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <AuthProvider>
          <ShopProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </ShopProvider>
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
