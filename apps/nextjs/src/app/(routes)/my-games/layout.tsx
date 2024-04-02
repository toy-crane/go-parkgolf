import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import BottomNav from "@/components/nav/bottom";
import { readUserSession } from "@/libs/auth";
import { isApp } from "@/libs/user-agent";

const DownloadBanner = dynamic(
  () => import("@/components/app/download-banner"),
  {
    ssr: false,
  },
);

const Layout = async (props: { children: React.ReactNode }) => {
  const session = await readUserSession();
  if (!session) return redirect("/score-card");
  const headersList = headers();
  const userAgent = headersList.get("user-agent")!;

  return (
    <>
      <DownloadBanner isApp={isApp(userAgent)} />
      <main className="content-grid pb-[var(--bottom-nav-height)]">
        {props.children}
      </main>
      <BottomNav />
    </>
  );
};

export default Layout;
