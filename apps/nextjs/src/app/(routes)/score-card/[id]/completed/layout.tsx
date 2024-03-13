import BackButton from "@/components/nav/back-button";

import ShareButton from "./_components/share-button";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <main className="h-short-screen grid-rows-score-board grid">
      <div className="flex items-center justify-between gap-1 pt-2">
        <BackButton />
        <ShareButton />
      </div>
      {props.children}
    </main>
  );
};

export default Layout;
