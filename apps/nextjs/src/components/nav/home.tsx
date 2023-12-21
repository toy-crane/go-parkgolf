import CurrentPositionButton from "@/app/(routes)/(home)/_components/current-position-button";

import { CommandMenu } from "../command-menu";

const HomeNav = ({
  selectOptions,
}: {
  selectOptions: { title: string; href: string }[];
}) => {
  return (
    <header className="content-grid z-header h-header fixed w-full">
      <nav className="relative flex items-center justify-center gap-2">
        <div className="flex-grow justify-center gap-2 md:flex-grow-0">
          <CommandMenu options={selectOptions} />
        </div>
        <CurrentPositionButton />
      </nav>
    </header>
  );
};

export default HomeNav;
