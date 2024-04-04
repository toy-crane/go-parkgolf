import { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import NearCourseMap from "@/app/(routes)/golf-courses/[slug]/_components/near-course-map";
import BreadcrumbNav from "@/components/nav/breadcrumb-nav";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import _ from "lodash";
import { Loader2 } from "lucide-react";

interface Props {
  params: { z_code: string; zs_code: string };
}

export async function generateMetadata(
  { params: { z_code, zs_code } }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const regionName = decodeURIComponent(z_code);
  const districtName = decodeURIComponent(zs_code);
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("lot_number_addresses")
    .select("golf_courses(*)")
    .eq("region_2depth_name", districtName);
  if (response.error) throw response.error;
  const golfCourses = response.data.flatMap((data) =>
    data.golf_courses ? data.golf_courses : [],
  );
  const courseCount = golfCourses.length;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images ?? [];

  if (courseCount) {
    const title = `${regionName} ${districtName}의 모든 파크골프장 목록`;
    const description = `
      ${regionName} ${districtName}에는 ${courseCount.toLocaleString()}개의 파크골프장이 있습니다. 
      보다 자세한 정보가 궁금하다면? 파크골프가자 홈페이지에서 확인하세요.
      전국 모든 파크 골프장 검색 및 주변 정보, 스코어 기록까지 가능합니다.
    `;
    const url = `${siteConfig.url}/gc/${z_code}/${zs_code}`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        images: [...previousImages],
      },
      twitter: {
        title,
        description,
        images: [...previousImages],
      },
      alternates: {
        canonical: url,
      },
    };
  } else {
    return {};
  }
}

const Page = async ({ params }: Props) => {
  const supabase = await createSupabaseServerClientReadOnly();
  const regionName = decodeURIComponent(params.z_code);
  const districtName = decodeURIComponent(params.zs_code);
  const response = await supabase
    .from("lot_number_addresses")
    .select("golf_courses(*)")
    .eq("region_2depth_name", districtName);
  if (response.error) throw response.error;
  const golfCourses = response.data.flatMap((data) =>
    data.golf_courses ? data.golf_courses : [],
  );

  return (
    <div>
      <BreadcrumbNav
        className="mb-1 mt-2"
        trail={[
          { title: "전국", link: "/gc" },
          { title: regionName, link: `/gc/${params.z_code}` },
          {
            title: districtName,
            link: `/gc/${params.z_code}/${params.zs_code}`,
          },
        ]}
      />
      <PageHeader className="flex flex-col pb-4 pt-2">
        <PageHeaderHeading className="underline decoration-[#22DC48] decoration-4 underline-offset-[10px]">
          {districtName} 파크골프장
        </PageHeaderHeading>
      </PageHeader>
      <section className="mb-4">
        <Suspense
          fallback={
            <div className="flex min-h-[360px] items-center justify-center">
              <Loader2
                className="h-5 w-5 animate-spin"
                size={24}
                color={"#71717A"}
              />
            </div>
          }
        >
          <NearCourseMap
            currentCourse={golfCourses[0]!}
            level={7}
            height="360px"
          />
        </Suspense>
      </section>
      <section className="mb-14 flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
          {golfCourses.map((course) => (
            <Card key={course.id} className="w-full hover:bg-neutral-50">
              <Link href={`/golf-courses/${course.slug}`}>
                <CardContent className="space-y-2 px-2 py-3">
                  <div>
                    <h2 className="text-lg font-bold">{course.name}</h2>
                  </div>
                  <div className="text-xs text-gray-500">
                    {course.hole_count}홀 <span> · </span>{" "}
                    {course.lot_number_address_name}
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Button className="w-full" asChild>
            <Link href="/">더 많은 파크골프장 알아보기</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Page;
