import BottomNav from "@/components/nav/bottom";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <div className="content-grid">{props.children}</div>
      <BottomNav />
    </>
  );
};

export default Layout;
