import dynamic from "next/dynamic";
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
    <>
      <DownloadBanner isApp={isApp(userAgent)} />
      <main className="content-grid h-short-screen grid-rows-score-board grid">
        {props.children}
      </main>
    </>
  );
};

export default Layout;
