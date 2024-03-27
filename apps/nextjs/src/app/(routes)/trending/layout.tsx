import { headers } from "next/headers";
import DownloadBanner from "@/components/app/download-banner";
import BottomNav from "@/components/nav/bottom";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { isApp } from "@/libs/user-agent";
import { TrendingUp } from "lucide-react";

import Products from "../../../components/ad/products";
import { TrendingNav } from "./nav";

const Layout = (props: { children: React.ReactNode }) => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent")!;
  return (
    <>
      {/* <DownloadBanner isApp={isApp(userAgent)} /> */}
      <main className="content-grid pb-[var(--bottom-nav-height)]">
        <div className="pb-28">
          <PageHeader className="relative flex flex-row items-center pb-4 md:pb-6">
            <PageHeaderHeading className="underline decoration-[#22DC48] decoration-4 underline-offset-[10px]">
              파크골프 트렌드
            </PageHeaderHeading>
            <TrendingUp className="ml-1 h-10 w-10" />
          </PageHeader>
          <section className="mb-8 space-y-4">
            <TrendingNav />
            {props.children}
          </section>
          <Products />
        </div>
      </main>
      <BottomNav />
    </>
  );
};

export default Layout;
