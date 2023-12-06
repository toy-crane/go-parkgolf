"use client;";

import Image from "next/image";
import Link from "next/link";

import { CommandMenu } from "../command-menu";
import { Button } from "../ui/button";

const HomeNav = ({
  selectOptions,
}: {
  selectOptions: { title: string; href: string }[];
}) => {
  return (
    <header className="content-grid z-header h-header fixed w-full">
      <nav className="breakout flex items-center justify-between gap-2">
        <div className="flex flex-grow gap-2 md:flex-grow-0">
          <Link href={"/"} className="flex-shrink-0 self-center">
            <Image
              src="/logo.png"
              width={40}
              height={40}
              alt="Logo"
              className="align-middle"
            />
          </Link>
          <CommandMenu options={selectOptions} />
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="text-secondary-foreground"
        >
          <Link href={"/register"}>로그인</Link>
        </Button>
      </nav>
    </header>
  );
};

export default HomeNav;
