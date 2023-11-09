import { cookies } from "next/headers";
import Main from "@/app/(routes)/home/main";
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
    return (
      <Main
        courses={courses}
        selectedCourse={selectedCourse}
        level={searchParams.level}
        lat={searchParams.lat}
        lng={searchParams.lng}
        modalOpen={searchParams.modal === "true"}
      />
    );
  }
};

export default Home;
