import dynamic from "next/dynamic";
import { headers } from "next/headers";
import BottomNav from "@/components/nav/bottom";
import { isApp } from "@/libs/user-agent";

import Nav from "./nav";

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
    <>
      <DownloadBanner isApp={isApp(userAgent)} />
      <Nav />
      <main className="content-grid pb-[var(--bottom-nav-height)]">
        {props.children}
      </main>
      <BottomNav />
    </>
  );
};

export default Layout;
