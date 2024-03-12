import { redirect } from "next/navigation";
import BottomNav from "@/components/nav/bottom";
import { readUserSession } from "@/libs/auth";

const Layout = async (props: { children: React.ReactNode }) => {
  const session = await readUserSession();
  if (!session) return redirect("/score-card");

  return (
    <>
      <main className="content-grid pb-[var(--bottom-nav-height)]">
        {props.children}
      </main>
      <BottomNav />
    </>
  );
};

export default Layout;
