import Link from "next/link";

import { CommandMenu } from "../command-menu";
import { Icons } from "../icons";

const HomeNav = ({
  selectOptions,
}: {
  selectOptions: { title: string; href: string }[];
}) => {
  return (
    <header className="content-grid z-header h-header sticky w-full bg-white">
      <div className="flex flex-grow items-center justify-center gap-2 md:flex-grow-0">
        <Link href="/">
          <Icons.logoFilled className="mr-1 h-6 w-6" />
        </Link>
        <CommandMenu options={selectOptions} />
      </div>
    </header>
  );
};

export default HomeNav;
