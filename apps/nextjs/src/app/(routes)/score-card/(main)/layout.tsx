import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

import Nav from "./_components/nav";

export const metadata: Metadata = {
  title: {
    default: "스코어 카드를 빠르고, 편리하게 관리하세요 | 파크골프가자",
    template: `%s | ${siteConfig.name}`,
  },
  alternates: {
    canonical: "/score-card",
  },
};

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <Nav />
      <main className="content-grid pb-[var(--bottom-nav-height)]">
        {props.children}
      </main>
    </>
  );
};

export default Layout;
