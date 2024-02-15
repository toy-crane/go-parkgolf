import { PageHeader, PageHeaderHeading } from "@/components/page-header";

const Page = () => {
  return (
    <div>
      <PageHeader className="relative flex flex-row items-center justify-between pb-4 md:pb-8">
        <PageHeaderHeading>파크골프 트렌딩</PageHeaderHeading>
      </PageHeader>
    </div>
  );
};

export default Page;
