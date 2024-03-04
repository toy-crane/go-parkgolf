import BackButton from "./back-button";

const Nav = async () => {
  return (
    <header className="content-grid h-header z-header fixed top-0 w-full border-b bg-white">
      <div className="content flex items-center gap-2">
        <nav className="md:content full flex w-full flex-1 items-center justify-between">
          <BackButton />
        </nav>
      </div>
    </header>
  );
};

export default Nav;
