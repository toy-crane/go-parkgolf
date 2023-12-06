import HomeNav from "@/components/nav/home";
import { DEFAULT_POSITION } from "@/config/map";

import { getGolfCourses } from "./components/action";
import CourseSheet from "./components/course-sheet";
import Footer from "./components/footer";
import MainMap from "./components/main-map";

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
  const selectedCourseId = Number(searchParams?.courseId) || undefined;
  const level = Number(searchParams?.level) || DEFAULT_POSITION.level;
  const lat = Number(searchParams?.lat) || undefined;
  const lng = Number(searchParams?.lng) || undefined;
  const modalOpen = searchParams?.modal === "true";

  const courses = await getGolfCourses();

  const selectedCourse = courses.find(
    (course) => course.id === selectedCourseId,
  );

  const selectedCourseLat = selectedCourse?.address[0]?.y;
  const selectedCourseLng = selectedCourse?.address[0]?.x;

  const position = {
    level: level,
    center: {
      lat: selectedCourseLat ?? lat ?? DEFAULT_POSITION.center.lat,
      lng: selectedCourseLng ?? lng ?? DEFAULT_POSITION.center.lng,
    },
  };

  const selectOptions = courses.map((course) => ({
    title: `${course.name} (${course.address[0]?.region_1depth_name} ${course.address[0]?.region_2depth_name})`,
    href: `/?${new URLSearchParams({
      courseId: String(course.id),
      modal: String(true),
      level: String(9),
    }).toString()}`,
  }));

  return (
    <>
      <HomeNav selectOptions={selectOptions} />
      <section>
        <MainMap
          courses={courses}
          selectedCourse={selectedCourse}
          position={position}
        />
      </section>
      <Footer />
      <CourseSheet selectedCourse={selectedCourse} open={modalOpen} />
    </>
  );
};

export default Home;
