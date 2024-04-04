import dynamic from "next/dynamic";
import { headers } from "next/headers";
import Link from "next/link";
import BottomNav from "@/components/nav/bottom";
import { isApp } from "@/libs/user-agent";

const DownloadBanner = dynamic(
  () => import("@/components/app/download-banner"),
  {
    ssr: false,
  },
);

const Layout = (props: {
  children: React.ReactNode;
  search: React.ReactNode;
  location: React.ReactNode;
  searchParams: { tab?: string };
  params: { slug: string };
}) => {
  // TODO: isWebview와 isMobileApp 통합이 필요함
  const headersList = headers();
  const userAgent = headersList.get("user-agent")!;

  return (
    <>
      <DownloadBanner isApp={isApp(userAgent)} />
      <div>{props.search}</div>
      <div>{props.location}</div>
      <nav className="flex gap-2">
        <Link href={`/golf-courses/${props.params.slug}/home`}>홈</Link>
        <Link href={`/golf-courses/${props.params.slug}/courses`}>코스</Link>
        <Link href={`/golf-courses/${props.params.slug}/reviews`}>리뷰</Link>
        <Link href={`/golf-courses/${props.params.slug}/nearby`}>주변</Link>
      </nav>
      <div>{props.children}</div>
      <BottomNav />
    </>
  );
};

export default Layout;
