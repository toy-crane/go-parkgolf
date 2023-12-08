import BottomNav from "@/components/nav/bottom";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      {props.children}
      <BottomNav />
    </>
  );
};

export default Layout;
