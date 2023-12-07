"use server";

import { headers } from "next/headers";
import Link from "next/link";
import { cn } from "@/libs/tailwind";
import { ClipboardEdit, Home, MoreHorizontal } from "lucide-react";

const BottomNav = () => {
  const pathname = headers().get("x-pathname") ?? "";
  const isHome = pathname === "/";
  const isMyGames =
    pathname.startsWith("/my-games") || pathname.startsWith("/score-card");
  const isSettings = pathname === "/settings";

  return (
    <header className="content-grid z-bottom-nav h-bottom-nav fixed bottom-0 w-full border-t bg-white">
      <nav className="flex items-center justify-around px-2">
        <Link
          href="/"
          className="flex flex-1 flex-col items-center justify-center gap-1"
        >
          <Home className={cn("opacity-50", isHome && "opacity-100")} />
          <span
            className={cn(
              "text-xs opacity-50",
              isHome && "font-bold opacity-100",
            )}
          >
            홈
          </span>
        </Link>
        <Link
          href="/my-games"
          className="flex flex-1 flex-col items-center justify-center gap-1"
        >
          <ClipboardEdit
            className={cn("opacity-50", isMyGames && "opacity-100")}
          />
          <span
            className={cn(
              "text-xs opacity-50",
              isMyGames && "font-bold opacity-100",
            )}
          >
            스코어 카드
          </span>
        </Link>
        <Link
          href="/settings"
          className="flex flex-1 flex-col items-center justify-center gap-1"
        >
          <MoreHorizontal
            className={cn("opacity-50", isSettings && "opacity-100")}
          />
          <span
            className={cn(
              "text-xs opacity-50",
              isSettings && "font-bold opacity-100",
            )}
          >
            설정
          </span>
        </Link>
      </nav>
    </header>
  );
};

export default BottomNav;
