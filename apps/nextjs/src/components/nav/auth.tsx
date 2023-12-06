"use client;";

import Image from "next/image";
import Link from "next/link";

const AuthNav = () => {
  return (
    <header className="content-grid z-header h-header fixed w-full border-b bg-white">
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

export default AuthNav;
