import { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import BottomNav from "@/components/nav/bottom";
import { siteConfig } from "@/config/site";
import createSupabaseBrowerClient from "@/libs/supabase/client";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import { isApp } from "@/libs/user-agent";
import type { GolfCourse } from "@/types";
import { Loader2 } from "lucide-react";

import BreadcrumbNav from "../../../../components/nav/breadcrumb-nav";
import Nav from "../../gc/nav";
import AdBanner from "./_components/ad-banner";
import CourseCommonInfo from "./_components/course-common-info";
import CourseDetailInfo from "./_components/course-detail-info";
import CourseDetailTab from "./_components/course-detail-tab";
import CTA from "./_components/cta";
import NearCourseInfo from "./_components/near-course-info";
import NearCourseMap from "./_components/near-course-map";
import ReviewInfo from "./_components/reviews";
import Title from "./_components/title";

interface Props {
  params: { slug: string };
  searchParams: { tab?: string };
}

export async function generateStaticParams() {
  const supabase = createSupabaseBrowerClient();
  const response = await supabase.from("golf_courses").select(`slug`);
  if (response.error) throw response.error;
  return response.data;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const supabase = await createSupabaseServerClientReadOnly();
  const slug = decodeURIComponent(params.slug);
  const query = supabase
    .from("golf_courses")
    .select(`*, contacts(*), operations(*)`)
    .eq("slug", slug)
    .eq("publish_status", "completed")
    .returns<GolfCourse[]>()
    .single();
  const result = await query;
  if (result.error) {
    throw Error(result.error.message);
  }
  const course = result.data;
  const operation = course.operations;
  const contact = course.contacts?.[0];

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images ?? [];

  if (course) {
    const title = `${course.name} 코스 및 예약 정보`;
    const description = `지번 주소 - ${course.lot_number_address_name} 
    \n 도로명 주소 - ${course.road_address_name ?? "정보 없음"}
    \n 영업시간 - ${operation?.opening_hours ?? "정보 없음"} \n 정기 휴무일 - ${
      operation?.regular_closed_days ?? "정보 없음"
    } \n 예약방법 - ${operation?.registration_method ?? "정보 없음"} 연락처 - ${
      contact?.phone_number ?? "정보 없음"
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

const DownloadBanner = dynamic(
  () => import("@/components/app/download-banner"),
  {
    ssr: false,
  },
);

export default async function Page({ params, searchParams }: Props) {
  const tab = searchParams?.tab ?? "home";
  const slug = decodeURIComponent(params.slug);
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("golf_courses")
    .select("*, lot_number_addresses(region_1depth_name, region_2depth_name)")
    .eq("publish_status", "completed")
    .eq("slug", slug)
    .returns<GolfCourse[]>()
    .single();
  if (response.error) throw response.error;
  const currentCourse = response.data;
  const address = currentCourse.lot_number_addresses;
  if (currentCourse === undefined) return notFound();

  // TODO: isWebview와 isMobileApp 통합이 필요함
  const headersList = headers();
  const userAgent = headersList.get("user-agent")!;

  return (
    <>
      <DownloadBanner isApp={isApp(userAgent)} />
      <Nav />
      <div className="content-grid">
        <BreadcrumbNav
          className="mb-1.5 mt-2"
          trail={[
            { title: "전국", link: "/gc" },
            {
              title: address.region_1depth_name,
              link: `/gc/${address.region_1depth_name}`,
            },
            address.region_2depth_name
              ? {
                  title: address.region_2depth_name,
                  link: `/gc/${address.region_1depth_name}/${address.region_2depth_name}`,
                }
              : undefined,
            {
              title: currentCourse.name,
              link: `/golf-courses/${currentCourse.slug}`,
            },
          ].flatMap((trail) => (trail ? trail : []))}
        />
        <section className="md:mb-2">
          <Suspense
            fallback={
              <div className="flex min-h-[320px] items-center justify-center">
                <Loader2
                  className="h-5 w-5 animate-spin"
                  size={24}
                  color={"#71717A"}
                />
              </div>
            }
          >
            <NearCourseMap currentCourse={currentCourse} />
          </Suspense>
        </section>
        <Title course={currentCourse} className="pt-2" />
        <AdBanner className="flex justify-center px-2 py-2 md:pb-4" />
        <CourseDetailTab
          course={currentCourse}
          selectedTab={tab}
          courseCommonInfo={<CourseCommonInfo courseId={currentCourse.id} />}
          nearCourseInfo={
            <Suspense
              fallback={
                <div className="flex min-h-[30vh] items-center justify-center">
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    size={24}
                    color={"#71717A"}
                  />
                </div>
              }
            >
              <NearCourseInfo course={currentCourse} />
            </Suspense>
          }
          reviewInfo={
            <Suspense
              fallback={
                <div className="flex min-h-[30vh] items-center justify-center">
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    size={24}
                    color={"#71717A"}
                  />
                </div>
              }
            >
              <ReviewInfo course={currentCourse} />
            </Suspense>
          }
          courseDetailInfo={
            <Suspense
              fallback={
                <div className="flex min-h-[30vh] items-center justify-center">
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    size={24}
                    color={"#71717A"}
                  />
                </div>
              }
            >
              <CourseDetailInfo
                golfCourseId={currentCourse.id}
                courseName={currentCourse.name}
              />
            </Suspense>
          }
        />
      </div>
      <div className="z-bottom-nav content-grid fixed bottom-[var(--bottom-nav-height)] w-full justify-center bg-gradient-to-t from-white from-80% to-transparent pb-3">
        <div className="md:content full flex justify-center pt-5">
          <CTA
            courseId={currentCourse.id}
            courseName={currentCourse.name}
            isApp={isApp(userAgent)}
          />
        </div>
      </div>
      <BottomNav />
    </>
  );
}
