import BottomNav from "@/components/nav/bottom";

const Layout = (props: { children: React.ReactNode }) => {
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
