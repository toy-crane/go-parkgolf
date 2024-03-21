const Layout = (props: { children: React.ReactNode }) => {
  return (
    <main className="h-short-screen grid-rows-score-board grid">
      {props.children}
    </main>
  );
};

export default Layout;
