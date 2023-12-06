import AuthNav from "@/components/nav/auth";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <AuthNav />
      <main className="content-grid">{props.children}</main>;
    </>
  );
};

export default Layout;
