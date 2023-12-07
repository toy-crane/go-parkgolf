import BottomNav from "@/components/nav/bottom";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <main>{props.children}</main>;
      <BottomNav />
    </>
  );
};

export default Layout;
