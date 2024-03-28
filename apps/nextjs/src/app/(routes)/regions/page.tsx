import Link from "next/link";
import BreadcrumbNav from "@/components/nav/breadcrumb-nav";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";

const Page = async () => {
  const supabase = await createSupabaseServerClientReadOnly();
  const [golfCourse, response] = await Promise.all([
    supabase.from("golf_courses").select("*", { count: "exact", head: true }),
    supabase.rpc("get_region_1depth_count").select("*"),
  ]);
  if (response.error) throw response.error;
  if (golfCourse.error) throw golfCourse.error;

  return (
    <div>
      <BreadcrumbNav
        className="mb-1 mt-2"
        trail={[{ title: "전국", link: "/regions" }]}
      />
      <PageHeader className="flex flex-col pb-2 pt-2 md:pb-4">
        <PageHeaderHeading className="underline decoration-[#22DC48] decoration-4 underline-offset-[10px]">
          전국 파크골프장
        </PageHeaderHeading>
        <PageHeaderDescription>{count}개 파크골프장</PageHeaderDescription>
      </PageHeader>
      <section className="mb-14 flex flex-col">
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
          {regions.map((region) => (
            <Link
              href={`/regions/${region.region_1depth_name}`}
              className="flex cursor-pointer items-center justify-between space-x-4 rounded-md px-2 py-4 hover:bg-stone-50"
              key={region.region_1depth_name}
            >
              <h2 className="text-2xl">{region.region_1depth_name}</h2>
              <div className="self-center">{region.count}개 구장</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Page;
