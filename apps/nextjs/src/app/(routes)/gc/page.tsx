import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/nav/breadcrumb-nav";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { siteConfig } from "@/config/site";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

export async function generateMetadata(
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const supabase = await createSupabaseServerClientReadOnly();
  const golfCourse = await supabase
    .from("golf_courses")
    .select("*", { count: "exact", head: true });
  if (golfCourse.error) throw golfCourse.error;
  const count = golfCourse.count;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images ?? [];

  if (count) {
    const title = `전국 모든 파크골프장 리스트`;
    const description = `
      전국에는 ${count.toLocaleString()}개의 파크골프장이 있습니다. 
      보다 자세한 정보가 궁금하다면? 파크골프가자 홈페이지에서 확인하세요.
      전국 모든 파크 골프장 검색 및 주변 정보, 스코어 기록까지 가능합니다.
    `;
    const url = `${siteConfig.url}/gc`;
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

const Page = async () => {
  const supabase = await createSupabaseServerClientReadOnly();
  const [golfCourse, response] = await Promise.all([
    supabase.from("golf_courses").select("*", { count: "exact", head: true }),
    supabase.rpc("get_region_1depth_count").select("*"),
  ]);
  if (response.error) throw response.error;
  if (golfCourse.error) throw golfCourse.error;

  const count = golfCourse.count;
  const regions = response.data;

  return (
    <div>
      <BreadcrumbNav
        className="mb-1 mt-2"
        trail={[{ title: "전국", link: "/gc" }]}
      />
      <PageHeader className="flex flex-col pb-2 pt-2 md:pb-4">
        <PageHeaderHeading className="underline decoration-[#22DC48] decoration-4 underline-offset-[10px]">
          전국 파크골프장
        </PageHeaderHeading>
        <PageHeaderDescription>{count}개 파크골프장</PageHeaderDescription>
      </PageHeader>
      <section className="mb-14 flex flex-col">
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
          {regions.map((region) => (
            <Link
              href={`/gc/${region.region_1depth_name}`}
              className="flex cursor-pointer items-center justify-between space-x-4 rounded-md px-2 py-4 hover:bg-stone-50"
              key={region.region_1depth_name}
            >
              <h2 className="text-2xl">{region.region_1depth_name}</h2>
              <div className="self-center">{region.count}개 구장</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Page;
