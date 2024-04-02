"use client";

import { on } from "events";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { playerSchema } from "./schema";

type Inputs = z.infer<typeof playerSchema>;

const PlayerFormDrawer = ({
  open,
  onOpenChange,
  values,
  onSubmit,
}: {
  open: boolean;
  values?: Inputs;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof playerSchema>) => void;
}) => {
  const form = useForm<Inputs>({
    shouldUnregister: false,
    mode: "onChange",
    resolver: zodResolver(playerSchema),
    values,
    defaultValues: {
      nickname: "",
    },
  });

  function handleSubmit(values: z.infer<typeof playerSchema>) {
    onSubmit(values);
    onOpenChange?.(false);
  }

  const isValid = form.formState.isValid;
  const isSubmitSucessful = form.formState.isSubmitSuccessful;

  // Input에 대한 ref 생성
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100); // 100ms 후에 실행
    }
  }, [open]);

  useEffect(() => {
    if (isSubmitSucessful) {
      form.reset({ nickname: "" });
    }
  }, [form, isSubmitSucessful]);

  // 키 다운 이벤트를 처리하는 함수
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      (event.currentTarget as HTMLInputElement).blur();
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-full max-h-[90%]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex h-full flex-col"
          >
            <DrawerHeader className="content-grid grid">
              <DrawerTitle>새로운 선수 등록</DrawerTitle>
              <DrawerDescription>
                게임을 같이 할 선수를 추가해 보세요.
              </DrawerDescription>
            </DrawerHeader>
            <div className="content-grid mb-4 flex-1">
              <div className="content">
                <div className="mb-4 flex flex-col space-y-2">
                  <FormLabel className="flex-1">선수 이름</FormLabel>
                  <FormField
                    control={form.control}
                    name={"nickname"}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            onKeyDown={handleKeyDown}
                            ref={inputRef}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <DrawerFooter className="content-grid grid gap-0 p-0 py-2 pb-5">
              <div className="content flex gap-2">
                <Button className="w-full" disabled={!isValid} type="submit">
                  플레이어 추가
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">취소</Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default PlayerFormDrawer;
