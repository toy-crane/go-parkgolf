const Layout = (props: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
      {props.children}
    </div>
  );
};

export default Layout;
