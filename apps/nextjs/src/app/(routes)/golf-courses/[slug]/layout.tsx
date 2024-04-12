import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import BottomNav from "@/components/nav/bottom";
import { siteConfig } from "@/config/site";
import { isApp } from "@/libs/user-agent";

import ScoreCardCTA from "./_components/create-score-cta";
import { DetailsNav } from "./_components/details-nav";
import { getCourse } from "./fetcher";

interface Props {
  params: { slug: string };
}

const DownloadBanner = dynamic(
  () => import("@/components/app/download-banner"),
  {
    ssr: false,
  },
);

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const course = await getCourse(params.slug);
  const phoneNumber = course.phone_number;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images ?? [];

  if (course) {
    const title = `${course.name} 코스 및 예약 정보`;
    const description = `지번 주소 - ${course.lot_number_address_name} 
    \n 영업시간 - ${course?.opening_hours ?? "정보 없음"} \n 정기 휴무일 - ${
      course?.regular_closed_days ?? "정보 없음"
    } \n 예약방법 - ${course?.registration_method ?? "정보 없음"} 연락처 - ${
      phoneNumber ?? "정보 없음"
    } 이외에도 파크골프가자에서 상세 코스, 예약 정보와 더불어 후기 등 골프장 관련 다양한 정보를 확인하세요.`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [...previousImages],
      },
      twitter: {
        title,
        description,
        images: [...previousImages],
      },
      alternates: {
        canonical: `${siteConfig.url}/golf-courses/${course.slug}`,
      },
    };
  } else {
    return {};
  }
}

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
      <DetailsNav className="content-grid mb-6" />
      <section className="content-grid pb-36">{props.children}</section>
      <ScoreCardCTA slug={props.params.slug} />
      <BottomNav />
    </>
  );
};

export default Layout;
