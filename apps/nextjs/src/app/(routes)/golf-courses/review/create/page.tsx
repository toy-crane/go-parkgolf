import { readUserSession } from "@/libs/auth";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import camelcaseKeys from "camelcase-keys";

import Form from "./form";
import Nav from "./nav";

const Page = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: {
    courseConditionRating?: number;
  };
}) => {
  const slug = decodeURIComponent(params.slug);
  const session = await readUserSession();
  const user = session?.user;
  const supabase = await createSupabaseServerClientReadOnly();

  if (!user) throw new Error("User not found");

  const { data: course, error } = await supabase
    .from("golf_courses")
    .select("*")
    .eq("slug", slug)
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
