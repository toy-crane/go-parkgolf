import { readUserSession } from "@/libs/auth";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import camelcaseKeys from "camelcase-keys";

import Form from "./form";
import Nav from "./nav";

const Page = async ({
  searchParams,
}: {
  searchParams: {
    courseConditionRating?: number;
    id?: string;
  };
}) => {
  if (!searchParams.id) {
    throw new Error("Course id not found");
  }
  const session = await readUserSession();
  const courseId = searchParams.id;
  const user = session?.user;
  const supabase = await createSupabaseServerClientReadOnly();

  if (!user) throw new Error("User not found");

  const { data: course, error } = await supabase
    .from("golf_courses")
    .select("*")
    .eq("id", courseId)
    .eq("publish_status", "completed")
    .single();
  if (error) throw error;

  const response = await supabase
    .from("golf_course_reviews")
    .select("*")
    .eq("golf_course_id", course.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (response.error) throw error;

  const review = response.data ? camelcaseKeys(response.data) : undefined;
  const courseConditionRating = Number(searchParams.courseConditionRating);

  return (
    <div>
      <Nav course={course} />
      <Form
        course={course}
        review={review}
        courseConditionRating={courseConditionRating}
      />
    </div>
  );
};

export default Page;
