import ShareButton from "./_components/share-button";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <main className="h-short-screen grid-rows-score-board grid">
      <div className="flex items-center justify-end gap-1 pt-2">
        <ShareButton />
      </div>
      {props.children}
    </main>
  );
};

export default Layout;
