import { createSupabaseServerClient } from "@/libs/supabase/server";

import Nav from "./nav";

const Page = async ({ params }: { params: { slug: string } }) => {
  const slug = decodeURIComponent(params.slug);
  const supabase = await createSupabaseServerClient();
  const { data: course, error } = await supabase
    .from("golf_course")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;

  return (
    <div>
      <Nav course={course} />
      Create Review
    </div>
  );
};

export default Page;
