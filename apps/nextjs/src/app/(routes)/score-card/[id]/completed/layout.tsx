import BackButton from "@/components/nav/back-button";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <main className="content-grid h-short-screen grid-rows-score-board grid">
      <div className="flex items-center gap-1 pt-2">
        <BackButton />
      </div>
      {props.children}
    </main>
  );
};

export default Layout;
