import { cookies } from "next/headers";
import Main from "@/app/(routes)/home/main";
import { DEFAULT_POSITION } from "@/config/map";
import { createFetch } from "@/libs/cache";
import type { Database } from "@/types/generated";
import type { DbResult, DbResultOk } from "@/types/supabase-helper";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

const Home = async ({
  searchParams,
}: {
  searchParams: {
    courseId?: string;
    level?: string;
    lat?: string;
    lng?: string;
    modal?: string;
  };
}) => {
  const cookieStore = cookies();
  const selectedCourseId = Number(searchParams?.courseId) || undefined;
  const level = Number(searchParams?.level) || DEFAULT_POSITION.level;
  const lat = Number(searchParams?.lat) || undefined;
  const lng = Number(searchParams?.lng) || undefined;
  const modalOpen = searchParams?.modal === "true";

  const supabase = createRouteHandlerClient<Database>(
    {
      cookies: () => cookieStore,
    },
    { options: { global: { fetch: createFetch({ cache: "force-cache" }) } } },
  );

  const query = supabase
    .from("golf_course")
    .select(`*, address(*), road_address(*), contact(*), operation(*)`);
  const result: DbResult<typeof query> = await query;

  if (result.data) {
    const courses: DbResultOk<typeof query> = result.data;

    const selectedCourse = courses.find(
      (course) => course.id === selectedCourseId,
    );

    const selectedCourseLat = selectedCourse?.address[0]?.y;
    const selectedCourseLng = selectedCourse?.address[0]?.x;

    const position = {
      level,
      center: {
        lat: selectedCourseLat ?? lat ?? DEFAULT_POSITION.center.lat,
        lng: selectedCourseLng ?? lng ?? DEFAULT_POSITION.center.lng,
      },
    };
    return (
      <Main
        courses={courses}
        selectedCourse={selectedCourse}
        modalOpen={modalOpen}
        position={position}
      />
    );
  }
};

export default Home;
