import BottomNav from "@/components/nav/bottom";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <div className="max-h-[100vh] overflow-hidden">
      <main>{props.children}</main>
      <BottomNav />
    </div>
  );
};

export default Layout;
