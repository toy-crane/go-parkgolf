import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import createSupabaseBrowerClient from "@/libs/supabase/client";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import type { GolfCourse } from "@/types";

import CTA from "./_components/cta";

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

export default async function Page({ params }: Props) {
  const slug = decodeURIComponent(params.slug);
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("golf_courses")
    .select("*")
    .eq("publish_status", "completed")
    .eq("slug", slug)
    .returns<GolfCourse[]>()
    .single();
  if (response.error) throw response.error;
  const currentCourse = response.data;
  if (currentCourse === undefined) return notFound();

  return (
    <>
      <div className="content-grid">
        <div className="z-bottom-nav content-grid fixed bottom-[var(--bottom-nav-height)] w-full justify-center bg-gradient-to-t from-white from-80% to-transparent pb-3">
          <div className="md:content full flex justify-center pt-5">
            <CTA courseId={currentCourse.id} courseName={currentCourse.name} />
          </div>
        </div>
      </div>
    </>
  );
}
