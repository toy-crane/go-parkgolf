"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/libs/tailwind";

const routes = [
  {
    name: "인기 코스 🔥",
    href: "/trending/hot",
  },
  {
    name: "최대 규모 ⚡️",
    href: "/trending/largest",
  },
];

type TrendingNavProps = React.HTMLAttributes<HTMLDivElement>;

export function TrendingNav({ className, ...props }: TrendingNavProps) {
  const pathname = usePathname();

  return (
    <div className="relative">
      <div className={cn("mb-4 flex items-center", className)} {...props}>
        {routes.map((route, index) => (
          <Link
            href={route.href}
            key={route.href}
            className={cn(
              "flex h-7 items-center justify-center rounded-full px-3 text-center text-sm transition-colors hover:font-bold",
              pathname?.startsWith(route.href) ||
                (index === 0 && pathname === "/")
                ? "bg-muted font-bold text-black"
                : "text-muted-foreground",
            )}
          >
            {route.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
