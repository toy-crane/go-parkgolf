import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import type { GolfCourse } from "@/types";

import { getCourse } from "../fetcher";

type GolfCouseWithDistance = GolfCourse & { dist_meters: number };

const Page = async ({ params }: { params: { slug: string } }) => {
  const supabase = await createSupabaseServerClientReadOnly();
  const course = await getCourse(params.slug);
  const nearbyResponse = await supabase.rpc("nearby_golf_courses", {
    latitude: course.lat,
    longitude: course.lng,
    max_results: 11,
  });
  if (nearbyResponse.error) throw Error;
  const courses = nearbyResponse.data as GolfCouseWithDistance[];
  const nearCourses = courses.filter((c) => c.id !== course.id);

  return (
    <section className="min-h-[25vh] space-y-6">
      <div className="space-y-10">
        <div className="space-y-3">
          <h2 className="text-foreground text-xl font-bold">
            주변 가까운 파크 골프장
          </h2>
          <div className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
            {nearCourses.map((course) => (
              <Card key={course.id} className="w-full hover:bg-neutral-50">
                <Link href={`/golf-courses/${course.slug}`}>
                  <CardContent className="space-y-2 px-2 py-3">
                    <div>
                      <div className="text-lg font-bold">{course.name}</div>
                      <div className="text-sm">
                        {Math.floor(course.dist_meters / 100) / 10}km 근처
                      </div>
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
        </div>
      </div>
    </section>
  );
};

export default Page;
