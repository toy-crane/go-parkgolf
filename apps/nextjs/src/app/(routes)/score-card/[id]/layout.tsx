const Layout = (props: { children: React.ReactNode }) => {
  return (
    <section className="h-dynamic-screen grid-rows-score-board grid">
      {props.children}
    </section>
  );
};

export default Layout;
