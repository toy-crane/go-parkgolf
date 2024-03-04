import Nav from "./_components/nav";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <Nav />
      <main className="content-grid pb-[var(--bottom-nav-height)]">
        {props.children}
      </main>
    </>
  );
};

export default Layout;
