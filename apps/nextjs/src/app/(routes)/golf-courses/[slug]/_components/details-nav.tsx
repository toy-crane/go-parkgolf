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
      <div className={"mb-4 flex items-center"} {...props}>
        {routes.map((route, index) => (
          <Link
            href={`/golf-courses/${params.slug}${route.href}`}
            key={route.href}
            className={cn(
              "hover:text-primary flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors",
              pathname?.includes(route.href) ||
                (index === 0 &&
                  pathname === path.join("/golf-courses", params.slug))
                ? "text-primary font-medium"
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
