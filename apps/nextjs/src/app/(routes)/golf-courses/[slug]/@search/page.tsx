import { CommandMenu } from "@/components/command-menu";
import BackButton from "@/components/nav/back-button";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

const Page = async () => {
  const supabase = await createSupabaseServerClientReadOnly();
  const result = await supabase
    .from("golf_courses")
    .select(`*, lot_number_address_name`)
    .eq("publish_status", "completed");
  if (result.error) throw result.error;
  const courses = result.data;
  const selectOptions = courses.map((course) => ({
    title: `${course.name} (${
      course.lot_number_address_name.split(" ").splice(0, 2).join(" ") ?? ""
    })`,
    href: `/golf-courses/${course.slug}`,
  }));
  return (
    <header className="content-grid h-header z-header sticky top-0 w-full border-b bg-white">
      <div className="content flex items-center gap-2">
        <nav className="md:content full flex w-full flex-1 items-center justify-between">
          <BackButton />
        </nav>
        <CommandMenu options={selectOptions} />
      </div>
    </header>
  );
};

export default Page;
