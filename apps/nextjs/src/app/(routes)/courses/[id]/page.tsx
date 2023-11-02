import { promises as fs } from "fs";
import path from "path";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { fetchCourse } from "@/libs/fetch";
import type { Course } from "@/types";

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  const jsonDirectory = path.join(process.cwd(), "resource");
  const fileContents = await fs.readFile(
    jsonDirectory + "/courses.json",
    "utf-8",
  );
  const courses = JSON.parse(fileContents) as Course[];
  return courses.map((course) => ({
    id: String(course.id),
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const course = await fetchCourse(params.id);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images ?? [];

  if (course) {
    const title = `${course.name} 예약 정보`;
    const description = `위치 - ${course.address.address_name} \n 영업시간 - ${
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
        canonical: `/golf-courses/${course.slug}`,
      },
    };
  } else {
    return {};
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const course = await fetchCourse(params.id);
  if (!course) {
    notFound();
  }
  permanentRedirect(`/golf-courses/${encodeURIComponent(course.slug)}`);
}
