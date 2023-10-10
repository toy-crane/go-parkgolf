import Main from "@/app/courses/main";
import { fetchCourses } from "@/libs/fetch";

const Home = async () => {
  const courses = await fetchCourses();
  return <Main courses={courses} />;
};

export default Home;
