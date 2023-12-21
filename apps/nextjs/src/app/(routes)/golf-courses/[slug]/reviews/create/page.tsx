import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { readUserSession } from "@/libs/auth";
import { createSupabaseServerClient } from "@/libs/supabase/server";
import camelcaseKeys from "camelcase-keys";

import Form from "./form";
import Nav from "./nav";

const Page = async ({ params }: { params: { slug: string } }) => {
  const slug = decodeURIComponent(params.slug);
  const session = await readUserSession();
  const user = session?.user;
  const supabase = await createSupabaseServerClient();

  if (!user) throw new Error("User not found");

  const { data: course, error } = await supabase
    .from("golf_course")
    .select("*")
    .eq("slug", slug)
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

  return (
    <div>
      <Nav course={course} />
      <Form course={course} review={review} />
    </div>
  );
};

export default Page;
