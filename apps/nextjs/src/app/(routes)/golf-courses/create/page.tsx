import { PageHeader, PageHeaderHeading } from "@/components/page-header";

import { GolfCourseForm } from "./form";

const Page = () => {
  return (
    <div>
      <PageHeader className="pb-4 pt-8 text-center">
        <PageHeaderHeading>신규 파크골프장 등록</PageHeaderHeading>
      </PageHeader>
      <GolfCourseForm />
    </div>
  );
};

export default Page;
