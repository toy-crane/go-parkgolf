import Script from "next/script";

export const runtime = "edge";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      <Script
        src="//dapi.kakao.com/v2/maps/sdk.js?appkey=6696e0ed688e7915643565b54b26d6fb&libraries=services,clusterer&autoload=false"
        strategy="beforeInteractive"
      />
      <main className="container mx-auto contents h-full w-full px-4 sm:px-6 lg:px-8">
        {props.children}
      </main>
    </>
  );
}
