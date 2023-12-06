import Script from "next/script";
import { env } from "@/env.mjs";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&libraries=services,clusterer&autoload=false`}
        strategy="beforeInteractive"
      />
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        {props.children}
      </div>
    </>
  );
};

export default Layout;
