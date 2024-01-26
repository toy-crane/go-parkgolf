import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import BottomNav from "@/components/nav/bottom";
import { siteConfig } from "@/config/site";
import createSupabaseBrowerClient from "@/libs/supabase/client";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import type { GolfCourse } from "@/types";
import { StaticMap } from "react-kakao-maps-sdk";

import CourseCommonInfo from "./_components/course-common-info";
import CourseDetailTab from "./_components/course-detail-tab";
import NearCourseInfo from "./_components/near-course-info";
import Reviews from "./_components/reviews";
import Title from "./_components/title";
import { GetCourses } from "./action";
import Nav from "./nav";

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
    const title = `${course.name} 예약 정보`;
    const description = `지번 주소 - ${course.lot_number_address_name} 
    \n 도로명 주소 - ${course.road_address_name}
    \n 영업시간 - ${operation?.opening_hours ?? "정보 없음"} \n 정기 휴무일 - ${
      operation?.regular_closed_days ?? "정보 없음"
    } \n 예약방법 - ${operation?.registration_method ?? "정보 없음"} 연락처 - ${
      contact?.phone_number ?? "정보 없음"
    }`;
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

export default async function Page({ params, searchParams }: Props) {
  const tab = searchParams?.tab ?? "home";
  const courses = await GetCourses();
  const slug = decodeURIComponent(params.slug);
  const currentCourse = courses.find((course) => course.slug === slug);
  if (currentCourse === undefined) return notFound();
  return (
    <>
      <Nav courseId={currentCourse.id} />
      <section className="mt-2">
        <StaticMap // 지도를 표시할 Container
          className="mb-8"
          marker={[
            {
              position: {
                lat: Number(currentCourse.lat),
                lng: Number(currentCourse.lng),
              },
              text: currentCourse.name,
            },
          ]}
          center={{
            // 지도의 중심좌표
            lat: Number(currentCourse.lat),
            lng: Number(currentCourse.lng),
          }}
          style={{
            // 지도의 크기
            width: "100%",
            height: "280px",
          }}
          level={6} // 지도의 확대 레벨
        />
      </section>
      <Title course={currentCourse} />
      <CourseDetailTab
        course={currentCourse}
        selectedTab={tab}
        courseCommonInfo={<CourseCommonInfo course={currentCourse} />}
        nearCourseInfo={<NearCourseInfo course={currentCourse} />}
        reviewInfo={<Reviews course={currentCourse} />}
      />
      <BottomNav />
    </>
  );
}
