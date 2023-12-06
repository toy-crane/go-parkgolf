import { promises as fs } from "fs";
import path from "path";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import createSupabaseBrowerClient from "@/libs/supabase/client";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import type { Course } from "@/types";

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  const supabase = createSupabaseBrowerClient();
  const response = await supabase.from("golf_course").select(`id`);
  if (response.error) throw response.error;
  return response.data.map((c) => String(c.id));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const supabase = await createSupabaseServerClientReadOnly();
  const query = supabase
    .from("golf_course")
    .select(`*, address(*), road_address(*), contact(*), operation(*)`)
    .eq("id", params.id);
  const result = await query;
  if (result.error) {
    throw Error("golf_course fetch에 실패하였습니다.");
  }
  const courses = result.data;
  const course = courses[0] as Course;
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

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClientReadOnly();
  const query = supabase.from("golf_course").select(`slug`).eq("id", params.id);

  const result = await query;
  if (result.error) {
    throw Error("golf_course fetch에 실패하였습니다.");
  }
  const courses = result.data;

  if (!courses[0]) {
    notFound();
  } else {
    permanentRedirect(`/golf-courses/${encodeURIComponent(courses[0].slug)}`);
  }
}
