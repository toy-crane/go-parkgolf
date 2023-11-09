import type { Course, Position } from "@/types";

import CourseSheet from "./course-sheet";
import Footer from "./footer";
import Header from "./header";
import MainMap from "./main-map";

const Main = ({
  courses,
  modalOpen,
  selectedCourse,
  position,
}: {
  courses: Course[];
  selectedCourse?: Course;
  modalOpen: boolean;
  position: Position;
}) => {
  return (
    <main>
      <Header courses={courses} />
      <section>
        <MainMap
          courses={courses}
          selectedCourse={selectedCourse}
          position={position}
        />
      </section>
      <Footer />
      <CourseSheet selectedCourse={selectedCourse} open={modalOpen} />
    </main>
  );
};

export default Main;
