import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { readUserSession } from "@/libs/auth";
import { createSupabaseServerClient } from "@/libs/supabase/server";
import { cn } from "@/libs/tailwind";
import { User } from "lucide-react";

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

const Page = async () => {
  const session = await readUserSession();
  const user = session?.user;
  const metaData = user?.user_metadata;

  const logout = async () => {
    "use server";
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <section className="space-y-8">
      <PageHeader>
        <PageHeaderHeading>설정</PageHeaderHeading>
      </PageHeader>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src={metaData?.avatar_url} alt="Avatar" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="ml-3 space-y-1">
          <p className="text-sm font-medium leading-none">
            {metaData?.full_name}
          </p>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </div>
      </div>
      <div className="space-y-8">
        <div className="space-y-2">
          <h3 className="px-2 text-lg font-medium">고객센터</h3>
          <Separator />
          <div className="flex flex-col">
            {CUSTOMER_CENTER_MENU.map(({ href, title }) => (
              <Link
                key={href}
                href={"https://forms.gle/NG8xkijGGzjo15979"}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "hover:bg-muted justify-start px-2 hover:underline",
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
                  "hover:bg-muted justify-start px-2 hover:underline",
                )}
              >
                {title}
              </Link>
            ))}
            <form action={logout}>
              <Button
                variant="ghost"
                className="hover:bg-muted block w-full justify-start px-2 text-left hover:underline"
              >
                로그아웃
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
