import { readUserSession } from "@/libs/auth";
import { createSupabaseServerClient } from "@/libs/supabase/server";

import Form from "./form";
import Nav from "./nav";

const Page = async ({ params }: { params: { slug: string } }) => {
  const slug = decodeURIComponent(params.slug);
  const session = await readUserSession();
  const user = session?.user;
  const supabase = await createSupabaseServerClient();

  if (!user) throw new Error("User not found");

  const { data: course, error } = await supabase
    .from("golf_courses")
    .select("*")
    .eq("slug", slug)
    .eq("publish_status", "completed")
    .single();
  if (error) throw error;

  return (
    <div>
      <Nav course={course} />
      <Form course={course} />
    </div>
  );
};

export default Page;
