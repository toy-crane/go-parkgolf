const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <main>{props.children}</main>
    </>
  );
};

export default Layout;
