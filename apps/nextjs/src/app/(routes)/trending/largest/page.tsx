import { Metadata } from "next";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

import CourseCard from "../course-card";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: {
    canonical: "/trending/largest",
  },
};

const Page = async () => {
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("golf_courses")
    .select("*")
    .order("hole_count", {
      ascending: false,
    })
    .limit(5);
  if (response.error) {
    console.error(response.error);
  }
  const courses = response.data;
  return (
    <div className="mb-6 grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-1">
      {courses?.map((course) => {
        return <CourseCard course={course} key={course.id} />;
      })}
    </div>
  );
};

export default Page;
