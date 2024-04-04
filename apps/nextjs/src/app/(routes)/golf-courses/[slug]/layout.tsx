import dynamic from "next/dynamic";
import { headers } from "next/headers";
import BottomNav from "@/components/nav/bottom";
import { isApp } from "@/libs/user-agent";

const DownloadBanner = dynamic(
  () => import("@/components/app/download-banner"),
  {
    ssr: false,
  },
);

const Layout = (props: { children: React.ReactNode }) => {
  // TODO: isWebview와 isMobileApp 통합이 필요함
  const headersList = headers();
  const userAgent = headersList.get("user-agent")!;

  return (
    <>
      <DownloadBanner isApp={isApp(userAgent)} />
      <div>{props.children}</div>
      <BottomNav />
    </>
  );
};

export default Layout;
