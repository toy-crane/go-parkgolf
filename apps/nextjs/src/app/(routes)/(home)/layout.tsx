import Script from "next/script";
import { env } from "@/env.mjs";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&libraries=services,clusterer&autoload=false`}
        strategy="beforeInteractive"
      />
      <main>{props.children}</main>;
    </>
  );
};

export default Layout;
