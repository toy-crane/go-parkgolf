import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { readUserSession } from "@/libs/auth";

const Layout = async (props: { children: React.ReactNode }) => {
  const session = await readUserSession();
  const pathname = headers().get("x-pathname") ?? "";
  if (!session)
    return redirect(
      `/login?${new URLSearchParams({ next: pathname }).toString()}`,
    );
  return <div className="content-grid">{props.children}</div>;
};

export default Layout;
