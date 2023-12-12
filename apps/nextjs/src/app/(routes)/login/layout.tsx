import ActionNav from "@/components/nav/action";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <ActionNav />
      <main className="content-grid">{props.children}</main>
    </>
  );
};

export default Layout;
