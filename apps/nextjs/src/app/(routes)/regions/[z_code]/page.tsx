import Link from "next/link";
import BreadcrumbNav from "@/components/nav/breadcrumb-nav";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import _ from "lodash";

const Page = async ({
  params,
}: {
  params: {
    z_code: string;
  };
}) => {
  const supabase = await createSupabaseServerClientReadOnly();
  const regionName = decodeURIComponent(params.z_code);
  const response = await supabase
    .rpc("get_region_2depth_count", {
      region_1depth_name: regionName,
    })
    .select("*");
  if (response.error) throw response.error;
  const regions = response.data;
  const totalCount = _.sumBy(regions, "count");

  return (
    <div>
      <BreadcrumbNav
        className="mb-1 mt-2"
        trail={[
          { title: "전국", link: "/regions" },
          { title: regionName, link: `/regions/${params.z_code}` },
        ]}
      />
      <PageHeader className="flex flex-col pb-2 pt-2 md:pb-4">
        <PageHeaderHeading className="underline decoration-[#22DC48] decoration-4 underline-offset-[10px]">
          {regionName} 파크골프장
        </PageHeaderHeading>
        <PageHeaderDescription>{totalCount}개 파크골프장</PageHeaderDescription>
      </PageHeader>
      <section className="mb-14 flex flex-col">
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
          {regions.map((region) => (
            <Link
              href={`/regions/${regionName}/${region.region_2depth_name}`}
              className="flex cursor-pointer items-center justify-between space-x-4 rounded-md px-2 py-4 hover:bg-stone-50"
              key={region.region_2depth_name}
            >
              <h2 className="text-2xl">{region.region_2depth_name}</h2>
              <div className="self-center">{region.count}개 구장</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Page;
