import "../styles/globals.css";

import { cn } from "@/libs/tailwind";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={cn("font-sans antialiased")}>{props.children}</body>
    </html>
  );
}
