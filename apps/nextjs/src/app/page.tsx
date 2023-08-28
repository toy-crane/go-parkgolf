"use client";

import { Button } from "@/components/button";

export const runtime = "edge";

export default function HomePage() {
  return (
    <main>
      <Button onClick={() => console.log("hello")}>Hello</Button>
    </main>
  );
}
