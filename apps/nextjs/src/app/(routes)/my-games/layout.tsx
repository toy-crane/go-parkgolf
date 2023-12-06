import GameNav from "@/components/nav/game";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <GameNav />
      <main className="content-grid">{props.children}</main>;
    </>
  );
};

export default Layout;
