import { notFound } from "next/navigation";
import BreadcrumbNav from "@/components/nav/breadcrumb-nav";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import type { GolfCourse } from "@/types";

import NearCourseMap from "../_components/near-course-map";

interface Props {
  params: { slug: string };
  searchParams: { tab?: string };
}

const Page = async ({ params }: Props) => {
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

  return (
    <section className="content-grid">
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
      <div className="md:mb-2">
        <NearCourseMap currentCourse={currentCourse} />
      </div>
    </section>
  );
};

export default Page;
