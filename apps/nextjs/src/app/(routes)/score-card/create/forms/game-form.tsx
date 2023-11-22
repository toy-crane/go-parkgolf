"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { useFieldArray, useFormContext } from "react-hook-form";
import type * as z from "zod";

import type { formSchema } from "./schema";

const GameForm = () => {
  const form = useFormContext<z.infer<typeof formSchema>>();

  const { fields, append, remove } = useFieldArray({
    name: "games",
    control: form.control,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-x-3">
        <FormLabel className="flex-1">코스 이름</FormLabel>
        <FormLabel className="flex-1">홀 수</FormLabel>
        <div className="w-4"></div>
      </div>
      {fields.map((_, index) => {
        return (
          <div key={index}>
            <div className="flex gap-x-3">
              <FormField
                control={form.control}
                key={index}
                name={`games.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                key={index + 1}
                name={`games.${index}.hole_count`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        pattern="[0-9]*"
                        inputMode="numeric"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button onClick={() => remove(index)} type="button">
                <MinusCircledIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        disabled={fields.length >= 4}
        onClick={() =>
          append({
            name: ["A", "B", "C", "D"][fields.length]!,
            hole_count: 9,
          })
        }
      >
        <PlusCircledIcon className="mr-1 h-4 w-4" />
        코스 추가하기
      </Button>
      <FormDescription>최대 4개 코스까지 입력 가능합니다</FormDescription>
      <FormMessage />
    </div>
  );
};

export default GameForm;
