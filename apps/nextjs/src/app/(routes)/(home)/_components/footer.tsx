import React from "react";
import { headers } from "next/headers";
import { isApp } from "@/libs/user-agent";

import AppCTA from "./app-cta";

const Footer = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent")!;

  return (
    <section>
      <nav className="z-header fixed bottom-[calc(var(--bottom-nav-height)+2px)] left-0 right-0 flex justify-end px-3 pb-3">
        <div className="flex flex-col gap-2">
          {!isApp(userAgent) && <AppCTA />}
        </div>
      </nav>
    </section>
  );
};

export default Footer;
