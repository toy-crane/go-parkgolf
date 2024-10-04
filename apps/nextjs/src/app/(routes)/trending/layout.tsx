import dynamic from "next/dynamic";
import { headers } from "next/headers";
import DynamicBanner from "@/components/ad/dynamic-banner";
import BottomNav from "@/components/nav/bottom";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { isApp } from "@/libs/user-agent";
import { TrendingUp } from "lucide-react";

import Products from "../../../components/ad/products";
import { TrendingNav } from "./nav";

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
      <main className="content-grid pb-[var(--bottom-nav-height)]">
        <div className="pb-28">
          <PageHeader className="relative flex flex-row items-center pb-4 md:pb-6">
            <PageHeaderHeading className="underline decoration-[#22DC48] decoration-4 underline-offset-[10px]">
              파크골프 트렌드
            </PageHeaderHeading>
          </PageHeader>
          <section className="mb-12 space-y-4">
            <TrendingNav />
            {props.children}
          </section>
          <DynamicBanner />
        </div>
      </main>
      <BottomNav />
    </>
  );
};

export default Layout;
