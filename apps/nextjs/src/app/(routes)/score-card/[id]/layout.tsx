const Layout = (props: { children: React.ReactNode }) => {
  return (
    <section className="h-short-screen grid-rows-score-board grid">
      {props.children}
    </section>
  );
};

export default Layout;
