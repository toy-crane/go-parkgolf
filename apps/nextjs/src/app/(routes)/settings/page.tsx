import Link from "next/link";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/libs/tailwind";

const CUSTOMER_CENTER_MENU = [
  {
    href: "/inquiry",
    title: "1:1 문의",
  },
];

const ETC_MENU = [
  {
    href: "/terms",
    title: "이용약관",
  },
  {
    href: "/privacy",
    title: "개인정보 처리방침",
  },
];

const Page = () => (
  <section className="space-y-3">
    <PageHeader className="pb-4 md:pb-8">
      <PageHeaderHeading>설정</PageHeaderHeading>
    </PageHeader>
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="px-2 text-lg font-medium">고객센터</h3>
        <Separator />
        <div className="flex flex-col">
          {CUSTOMER_CENTER_MENU.map(({ href, title }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "hover:bg-transparent hover:underline",
                "hover:bg-muted",
                "justify-start",
                "px-2",
              )}
            >
              {title}
            </Link>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="px-2 text-lg font-medium">기타</h3>
        <Separator />
        <div className="flex flex-col lg:space-y-1">
          {ETC_MENU.map(({ href, title }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "hover:bg-transparent hover:underline",
                "hover:bg-muted",
                "justify-start",
                "px-2",
              )}
            >
              {title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Page;
