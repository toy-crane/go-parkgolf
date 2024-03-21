import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";

const FormHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <PageHeader className="relative gap-1 pb-4 pt-3 md:pb-8 md:pt-6">
      <PageHeaderHeading>{title}</PageHeaderHeading>
      <PageHeaderDescription>{description}</PageHeaderDescription>
    </PageHeader>
  );
};

export default FormHeader;
