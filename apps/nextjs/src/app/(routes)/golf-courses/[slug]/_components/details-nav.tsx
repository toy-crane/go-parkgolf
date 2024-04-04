"use client";

import path from "path";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/libs/tailwind";

const routes = [
  {
    href: "/home",
    name: "홈",
  },
  {
    href: "/courses",
    name: "정보",
  },
  {
    href: "/reviews",
    name: "후기",
  },
  {
    href: "/nearby",
    name: "주변",
  },
];

interface DetailsNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DetailsNav({ className, ...props }: DetailsNavProps) {
  const pathname = usePathname();
  const params = useParams<{ slug: string }>();

  return (
    <div className={className}>
      <div
        className={
          "bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1"
        }
        {...props}
      >
        {routes.map((route, index) => (
          <Link
            href={`/golf-courses/${params.slug}${route.href}`}
            key={route.href}
            className={cn(
              "ring-offset-background focus-visible:ring-ring inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              pathname?.includes(route.href) ||
                (index === 0 &&
                  pathname === path.join("/golf-courses", params.slug))
                ? "bg-background text-foreground"
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
