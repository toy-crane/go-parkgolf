import BottomNav from "@/components/nav/bottom";
import GameNav from "@/components/nav/game";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <GameNav />
      <main className="content-grid pb-[var(--bottom-nav-height)]">
        {props.children}
      </main>
      ;
      <BottomNav />
    </>
  );
};

export default Layout;
