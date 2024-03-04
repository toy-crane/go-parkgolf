import KakaoMap from "@/components/map/kakao-map";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import type { GolfCourse } from "@/types";

const NearCourseMap = async ({
  currentCourse,
}: {
  currentCourse: GolfCourse;
}) => {
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("golf_courses")
    .select("*,contacts(*), operations(*)")
    .eq("publish_status", "completed")
    .returns<GolfCourse[]>();
  if (response.error) throw response.error;
  const courses = response.data;
  const markers = courses.map((course) => ({
    position: {
      lat: Number(course.lat),
      lng: Number(course.lng),
    },
    text: course.name,
    to: `/golf-courses/${course.slug}`,
    selected: course.slug === currentCourse.slug,
  }));
  return (
    <KakaoMap
      markers={markers}
      center={{
        // 지도의 중심좌표
        lat: Number(currentCourse.lat),
        lng: Number(currentCourse.lng),
      }}
      size={{ width: "100%", height: "320px" }}
      level={4}
    />
  );
};

export default NearCourseMap;
