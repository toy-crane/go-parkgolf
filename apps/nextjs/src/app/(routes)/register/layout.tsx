import AuthNav from "@/components/nav/auth";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <AuthNav />
      <main className="content-grid pt-[var(--header-height)]">
        {props.children}
      </main>
      ;
    </>
  );
};

export default Layout;
