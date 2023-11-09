import React from "react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer>
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex justify-end px-3 pb-3">
        <h2>
          <Button className="font-bold" asChild size="sm">
            <a
              href="https://forms.gle/41DvTTg1Z3SrQpNQ8"
              target="_blank"
              rel="noopener noreferrer"
            >
              제작자에게 문의하기
            </a>
          </Button>
        </h2>
      </nav>
    </footer>
  );
};

export default Footer;
