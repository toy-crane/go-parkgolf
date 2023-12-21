import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { readUserSession } from "@/libs/auth";

const Layout = async (props: { children: React.ReactNode }) => {
  const session = await readUserSession();
  const pathname = headers().get("x-pathname") ?? "";
  if (!session) return redirect(`/login?next=${pathname}`);

  return <div>{props.children}</div>;
};

export default Layout;
