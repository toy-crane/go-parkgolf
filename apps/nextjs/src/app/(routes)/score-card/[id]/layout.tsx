const Layout = (props: { children: React.ReactNode }) => {
  return (
    <section className="h-dynamic-screen grid-rows-score-board grid overflow-hidden">
      {props.children}
    </section>
  );
};

export default Layout;
