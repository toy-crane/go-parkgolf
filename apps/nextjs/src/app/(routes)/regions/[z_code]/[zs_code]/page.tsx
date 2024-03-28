import { Suspense } from "react";
import Link from "next/link";
import NearCourseMap from "@/app/(routes)/golf-courses/[slug]/_components/near-course-map";
import BreadcrumbNav from "@/components/nav/breadcrumb-nav";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import _ from "lodash";
import { Loader2 } from "lucide-react";

const Page = async ({
  params,
}: {
  params: {
    z_code: string;
    zs_code: string;
  };
}) => {
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
          { title: "전국", link: "/regions" },
          { title: regionName, link: `/regions/${params.z_code}` },
          {
            title: districtName,
            link: `/regions/${params.z_code}/${params.zs_code}`,
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
      <section className="mb-14 flex flex-col">
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
          {golfCourses.map((course) => (
            <Card key={course.id} className="w-full hover:bg-neutral-50">
              <Link href={`/golf-courses/${course.slug}`}>
                <CardContent className="space-y-2 px-2 py-3">
                  <div>
                    <div className="text-lg font-bold">{course.name}</div>
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
      </section>
    </div>
  );
};

export default Page;
