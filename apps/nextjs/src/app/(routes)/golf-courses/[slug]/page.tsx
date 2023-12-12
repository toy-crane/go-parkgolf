import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import createSupabaseBrowerClient from "@/libs/supabase/client";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

import { GetCourses } from "./action";
import CourseDetail from "./course-detail";
import Nav from "./nav";

interface Props {
  params: { slug: string };
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // 지구의 반경 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dlng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dlng / 2) *
      Math.sin(dlng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function generateStaticParams() {
  const supabase = createSupabaseBrowerClient();
  const response = await supabase.from("golf_course").select(`slug`);
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
    .from("golf_course")
    .select(`*, address(*), road_address(*), contact(*), operation(*)`)
    .eq("slug", slug)
    .single();
  const result = await query;
  if (result.error) {
    throw Error(result.error.message);
  }
  const course = result.data;
  const address = course.address[0];
  const operation = course.operation[0];
  const contact = course.contact[0];

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images ?? [];

  if (course) {
    const title = `${course.name} 예약 정보`;
    const description = `위치 - ${address?.address_name} \n 영업시간 - ${
      operation?.opening_hours ?? "정보 없음"
    } \n 정기 휴무일 - ${
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

export default async function Page({ params }: { params: { slug: string } }) {
  const courses = await GetCourses();
  const slug = decodeURIComponent(params.slug);
  const currentCourse = courses.find((course) => course.slug === slug);
  const allCoursesExcludeMe = courses.filter((course) => course.slug !== slug);

  if (currentCourse === undefined) return notFound();

  const nearCourses = allCoursesExcludeMe.filter((course) => {
    const courseLat = course.address[0]?.y ?? 0;
    const courseLng = course.address[0]?.x ?? 0;
    return (
      haversineDistance(
        currentCourse.address[0]?.y ?? 0,
        currentCourse.address[0]?.x ?? 0,
        courseLat,
        courseLng,
      ) <= 20
    );
  });

  return (
    <>
      <Nav course={currentCourse} />
      <CourseDetail course={currentCourse} nearCourses={nearCourses} />
    </>
  );
}
