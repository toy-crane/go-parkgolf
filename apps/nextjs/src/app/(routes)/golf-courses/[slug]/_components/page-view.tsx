import { kv } from "@vercel/kv";

async function increasePageViews(courseId: string) {
  try {
    const pageViewKey = `page:course-detail:views`;
    return await kv.zincrby(pageViewKey, 1, courseId);
  } catch (error) {
    console.error("Error incrementing page views:", error);
    return undefined;
  }
}

export default async function PageView({ courseId }: { courseId: string }) {
  const totalViews = await increasePageViews(courseId);
  return (
    <>
      {totalViews && (
        <span className="text-sm text-gray-500">
          조회 {totalViews.toLocaleString()}
        </span>
      )}
    </>
  );
}
