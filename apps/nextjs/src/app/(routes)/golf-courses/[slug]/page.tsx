import { promises as fs } from "fs";
import path from "path";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { fetchCourseBySlug, fetchNearCourse } from "@/libs/fetch";
import type { Course } from "@/types";

import CourseDetail from "./course-detail";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const jsonDirectory = path.join(process.cwd(), "resource");
  const fileContents = await fs.readFile(
    jsonDirectory + "/courses.json",
    "utf-8",
  );
  const courses = JSON.parse(fileContents) as Course[];
  return courses.map((course) => ({
    slug: String(course.slug),
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const course = await fetchCourseBySlug(decodeURIComponent(params.slug));

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images ?? [];

  if (course) {
    const title = `${course.name} 예약 정보`;
    const description = `${course.name} \n
    위치 - ${course.address.address_name} \n 영업시간 - ${
      course.operation.opening_hours ?? "정보 없음"
    } \n 정기 휴무일 - ${
      course.operation.regular_closed_days ?? "정보 없음"
    } \n 예약방법 - ${
      course.operation.registration_method ?? "정보 없음"
    } 연락처 - ${course.contact.phone_number ?? "정보 없음"}`;
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
        canonical: `/courses/${course.slug}`,
      },
    };
  } else {
    return {};
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const course = await fetchCourseBySlug(slug);
  if (!course) {
    notFound();
  }
  const nearCourses = await fetchNearCourse(course?.id, 20);
  if (course) {
    return <CourseDetail course={course} nearCourses={nearCourses} />;
  }
  notFound();
}
