import { notFound } from "next/navigation";
import BreadcrumbNav from "@/components/nav/breadcrumb-nav";

import AdBanner from "../_components/ad-banner";
import NearCourseMap from "../_components/near-course-map";
import Title from "../_components/title";
import { getCourse } from "../fetcher";

export interface Props {
  params: { slug: string };
  searchParams: { tab?: string };
}

const Page = async ({ params }: Props) => {
  const currentCourse = await getCourse(params.slug);
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
      <Title course={currentCourse} className="pt-2" />
      <AdBanner className="flex justify-center px-2 py-2 md:pb-4" />
    </section>
  );
};

export default Page;
