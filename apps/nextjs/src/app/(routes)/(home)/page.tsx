import HomeNav from "@/components/nav/home";
import { DEFAULT_POSITION } from "@/config/map";

import { getCourses, getGolfCourseReviews } from "./_components/action";
import CourseDetailSheet from "./_components/course-detail-sheet";
import CourseSheet from "./_components/course-sheet";
import Footer from "./_components/footer";
import MainMap from "./_components/main-map";

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
  const selectedCourseId = searchParams?.courseId
    ? String(searchParams.courseId)
    : undefined;
  const level = Number(searchParams?.level) || DEFAULT_POSITION.level;
  const lat = Number(searchParams?.lat) || undefined;
  const lng = Number(searchParams?.lng) || undefined;
  const modalOpen = searchParams?.modal === "true";

  const courses = await getCourses();

  const selectedCourse = courses.find(
    (course) => course.id === selectedCourseId,
  );
  const reviews = await getGolfCourseReviews(selectedCourseId);

  const position = {
    level: level,
    center: {
      lat: lat ?? DEFAULT_POSITION.center.lat,
      lng: lng ?? DEFAULT_POSITION.center.lng,
    },
  };

  const selectOptions = courses.map((course) => ({
    title: `${course.name} (${
      course.lot_number_addresses?.region_1depth_name ?? ""
    }${
      course.lot_number_addresses?.region_2depth_name
        ? ` ${course.lot_number_addresses?.region_2depth_name}`
        : ""
    })`,
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
      <CourseDetailSheet
        selectedCourse={selectedCourse}
        open={modalOpen}
        reviews={reviews}
      />
    </>
  );
};

export default Home;
