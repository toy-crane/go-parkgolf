"use client;";

import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";

const HomeNav = () => {
  return (
    <header className="content-grid z-header h-header fixed w-full border-b bg-white">
      <nav className="breakout flex items-center justify-between">
        <Link href={"/"} className="flex-shrink-0 self-center">
          <Image
            src="/logo.png"
            width={40}
            height={40}
            alt="Logo"
            className="align-middle"
          />
        </Link>
        <Button
          variant="outline"
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
