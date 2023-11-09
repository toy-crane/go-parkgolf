import { cookies } from "next/headers";
import Main from "@/app/(routes)/courses/main";
import { createFetch } from "@/libs/cache";
import type { Database } from "@/types/generated";
import type { DbResult, DbResultOk } from "@/types/supabase-helper";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

const Home = async ({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) => {
  const cookieStore = cookies();
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
    return (
      <Main
        courses={courses}
        level={searchParams.level as string}
        lat={searchParams.lat as string}
        lng={searchParams.lng as string}
        courseId={Number(searchParams.courseId)}
        modalOpen={searchParams.modal === "true"}
      />
    );
  }
};

export default Home;
