import { redirect } from "next/navigation";
import BottomNav from "@/components/nav/bottom";
import { readUserSession } from "@/libs/auth";

const Layout = async (props: { children: React.ReactNode }) => {
  const session = await readUserSession();

  if (!session) {
    return redirect("/login");
  }

  return (
    <>
      <main className="content-grid">{props.children}</main>;
      <BottomNav />
    </>
  );
};

export default Layout;
