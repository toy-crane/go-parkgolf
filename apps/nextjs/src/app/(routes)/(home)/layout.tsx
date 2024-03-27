import dynamic from "next/dynamic";
import BottomNav from "@/components/nav/bottom";
import { headers } from "next/headers";
import { isApp } from "@/libs/user-agent";

const DownloadBanner = dynamic(
  () => import("@/components/app/download-banner"),
  {
    ssr: false,
  },
);

const Layout = (props: { children: React.ReactNode }) => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent")!;
  return (
    <div className="max-h-[100vh] overflow-hidden">
      <DownloadBanner isApp={isApp(userAgent)}/>
      <main>{props.children}</main>
      <BottomNav />
    </div>
  );
};

export default Layout;
