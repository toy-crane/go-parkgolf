import { redirect } from "next/navigation";
import { readUserSession } from "@/libs/auth";

const Layout = async (props: { children: React.ReactNode }) => {
  const session = await readUserSession();
  if (!session) return redirect("/login");

  return (
    <>
      <main className="content-grid pb-[var(--bottom-nav-height)]">
        {props.children}
      </main>
    </>
  );
};

export default Layout;
