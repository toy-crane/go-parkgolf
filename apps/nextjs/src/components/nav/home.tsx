import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import CurrentPositionButton from "@/app/(routes)/(home)/components/current-position-button";
import { useUserStore } from "@/libs/store/user";
import { createSupabaseServerClient } from "@/libs/supabase/server";

import { CommandMenu } from "../command-menu";
import { Button } from "../ui/button";

const HomeNav = ({
  selectOptions,
}: {
  selectOptions: { title: string; href: string }[];
}) => {
  const user = useUserStore.getState().user;
  const logout = async () => {
    "use server";
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <header className="content-grid z-header h-header fixed w-full">
      <nav className="breakout relative flex items-center justify-between gap-2">
        <div className="flex flex-grow gap-2 md:flex-grow-0">
          <Link href={"/"} className="flex-shrink-0 self-center">
            <Image
              src="/logo.png"
              width={40}
              height={40}
              alt="Logo"
              className="align-middle"
            />
          </Link>
          <CommandMenu options={selectOptions} />
        </div>

        {user ? (
          <>
            <form action={logout}>
              <Button
                variant="secondary"
                size="sm"
                className="text-secondary-foreground"
              >
                로그아웃
              </Button>
            </form>
          </>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="text-secondary-foreground"
          >
            <Link href={"/login"}>로그인</Link>
          </Button>
        )}

        <CurrentPositionButton />
      </nav>
    </header>
  );
};

export default HomeNav;
