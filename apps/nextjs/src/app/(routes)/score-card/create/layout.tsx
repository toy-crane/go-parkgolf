const Layout = (props: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto max-w-2xl  px-4 sm:px-6 lg:px-8">
      {props.children}
    </div>
  );
};

export default Layout;
