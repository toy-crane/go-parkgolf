"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useAmplitude } from "@/libs/amplitude";
import { cn } from "@/libs/tailwind";

interface Props {
  options: { title: string; href: string }[];
}

export function CommandMenu({ options }: Props) {
  const router = useRouter();
  const { track } = useAmplitude();
  const [open, setOpen] = React.useState(false);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "text-muted-foreground relative h-6 w-full justify-start rounded-3xl bg-neutral-50 text-xs font-normal shadow-sm sm:pr-12",
        )}
        onClick={() => {
          track("search button clicked");
          setOpen(true);
        }}
      >
        <span className="hidden lg:inline-flex">
          파크골프장 이름 또는 주소로 검색
        </span>
        <span className="inline-flex lg:hidden">파크골프장 또는 주소 입력</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="주소 또는 이름을 입력해주세요." />
        <CommandList>
          <CommandEmpty>해당하는 검색 결과가 없습니다.</CommandEmpty>
          <CommandGroup>
            {options.map(({ href, title }) => (
              <CommandItem
                key={href}
                value={title}
                onSelect={() => {
                  track("search result clicked");
                  runCommand(() => router.push(href));
                }}
              >
                {title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
