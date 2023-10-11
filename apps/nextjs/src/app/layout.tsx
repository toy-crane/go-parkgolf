import "../styles/globals.css";

import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import { env } from "@/env.mjs";
import { AmplitudeProvider } from "@/libs/amplitude";
import { cn } from "@/libs/tailwind";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "파크골프장 추천",
    "근처 파크골프장",
    "파크골프장 예약",
    "파크골프장 비교",
    "지역별 파크골프장",
    "파크골프장 리뷰",
    "파크골프장 가격",
  ],
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.links.blog,
    },
  ],
  creator: siteConfig.author,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@alwaysfun2183",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <AmplitudeProvider apiKey={env.NEXT_PUBLIC_AMPLITUDE_API_KEY}>
        <body
          className={cn("bg-background min-h-screen font-sans antialiased")}
        >
          <Script
            src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&libraries=services,clusterer&autoload=false`}
            strategy="beforeInteractive"
          />
          <main className="container mx-auto contents h-full w-full px-4 sm:px-6 lg:px-8">
            <div className="relative flex min-h-screen flex-col">
              {props.children}
            </div>
          </main>
          <Toaster />
        </body>
      </AmplitudeProvider>
    </html>
  );
}
