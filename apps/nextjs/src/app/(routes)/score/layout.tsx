import { redirect } from "next/navigation";
import ActionNav from "@/components/nav/action";
import { readUserSession } from "@/libs/auth";

const Layout = async (props: { children: React.ReactNode }) => {
  const session = await readUserSession();

  if (!session) {
    return redirect("/login");
  }

  return (
    <>
      <ActionNav />
      <main className="content-grid pt-[var(--header-height)]">
        {props.children}
      </main>
    </>
  );
};

export default Layout;
