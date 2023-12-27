import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { readUserSession } from "@/libs/auth";
import { createSupabaseServerClient } from "@/libs/supabase/server";
import { cn } from "@/libs/tailwind";
import { Identify, identify } from "@amplitude/analytics-node";
import { User } from "lucide-react";

import DeleteAlert from "./delete-alert";

const ETC_MENU = [
  {
    href: "https://toycrane.notion.site/f6000220f9614c4fab076b332d8b6526?pvs=4",
    title: "이용약관",
  },
  {
    href: "https://toycrane.notion.site/5cf165a1957e4c01afb5b2665bb34306?pvs=4",
    title: "개인정보 처리방침",
  },
];

const Page = async () => {
  const session = await readUserSession();
  const user = session?.user;
  const metaData = user?.user_metadata;

  if (!user) throw new Error("user is not defined");

  const supabase = await createSupabaseServerClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session?.user?.id)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error("profile is not defined");

  const logout = async () => {
    "use server";
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    identify(new Identify(), {
      user_id: undefined,
    });
    // client user 동기화를 위해서 validate를 다시 해준다.
    revalidatePath("/");
    redirect("/");
  };

  return (
    <section className="space-y-8">
      <PageHeader>
        <PageHeaderHeading>설정</PageHeaderHeading>
      </PageHeader>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src={profile?.avatar_url} alt="Avatar" />
          <AvatarFallback>{profile?.username?.[0]}</AvatarFallback>
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
            <Link
              href={"https://forms.gle/NG8xkijGGzjo15979"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "hover:bg-muted justify-start px-2 hover:underline",
              )}
            >
              1:1 문의
            </Link>
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
          <Separator />
          <form action={logout}>
            <Button
              variant="ghost"
              className="hover:bg-muted block w-full justify-start px-2 text-left hover:underline"
            >
              로그아웃
            </Button>
          </form>
          <DeleteAlert />
        </div>
      </div>
    </section>
  );
};

export default Page;
