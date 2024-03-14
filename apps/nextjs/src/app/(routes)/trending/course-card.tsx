import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { GolfCourse } from "@/types";
import { kv } from "@vercel/kv";

async function getPageView({ courseId }: { courseId: string }) {
  try {
    const pageViewKey = `page:course-detail:views`;
    const pageViews = await kv.zscore(pageViewKey, courseId);
    return pageViews;
  } catch (error) {
    console.error("Error getting page views:", error);
    return null;
  }
}

const CourseCard = async ({
  course: { id, slug, name, lot_number_address_name, hole_count },
}: {
  course: GolfCourse;
}) => {
  const pageView = await getPageView({ courseId: id });
  return (
    <Card key={id} className="w-full hover:bg-neutral-50">
      <Link href={`/golf-courses/${slug}`}>
        <CardContent className="space-y-2 px-2 py-3">
          <div>
            <div className="text-lg font-bold">{name}</div>
            {pageView && (
              <div className="text-xs">
                누적 조회수 {pageView?.toLocaleString()}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {hole_count}홀 <span> · </span> {lot_number_address_name}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default CourseCard;
