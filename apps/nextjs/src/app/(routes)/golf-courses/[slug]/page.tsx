import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import BottomNav from "@/components/nav/bottom";
import { haversineDistance } from "@/libs/map";
import createSupabaseBrowerClient from "@/libs/supabase/client";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import type { GolfCourse } from "@/types";

import CourseDetail from "./_components/course-detail";
import { GetCourses, GetReviews } from "./action";
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
        canonical: `/golf-courses/${course.slug}`,
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
  const allCoursesExcludeMe = courses.filter((course) => course.slug !== slug);

  if (currentCourse === undefined) return notFound();

  const reviews = await GetReviews(currentCourse?.id);

  const nearCourses = allCoursesExcludeMe.filter((course) => {
    const courseLat = course.lat ?? 0;
    const courseLng = course.lng ?? 0;
    return (
      haversineDistance(
        currentCourse.lat ?? 0,
        currentCourse.lng ?? 0,
        courseLat,
        courseLng,
      ) <= 20
    );
  });
  return (
    <>
      <Nav courseId={currentCourse.id} />
      <CourseDetail
        course={currentCourse}
        nearCourses={nearCourses}
        reviews={reviews}
        selectedTab={tab}
      />
      <BottomNav />
    </>
  );
}
