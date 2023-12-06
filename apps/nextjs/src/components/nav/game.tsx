"use client;";

import Image from "next/image";
import Link from "next/link";

const GameNav = () => {
  return (
    <header className="content-grid h-header border-b bg-white">
      <nav className="flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            width={40}
            height={40}
            alt="Logo"
            className="align-middle"
          />
        </Link>
      </nav>
    </header>
  );
};

export default GameNav;
