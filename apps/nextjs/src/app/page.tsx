import Main from "@/app/(routes)/courses/main";
import { fetchCourses } from "@/libs/fetch";

const Home = async ({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) => {
  const courses = await fetchCourses();
  return (
    <Main
      courses={courses}
      level={searchParams.level as string}
      lat={searchParams.lat as string}
      lng={searchParams.lng as string}
    />
  );
};

export default Home;
