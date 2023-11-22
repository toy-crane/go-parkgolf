"use client";

import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TagInput } from "@/components/ui/tag-input";
import type { Tag } from "@/components/ui/tag-input";
import { useFormContext } from "react-hook-form";
import type * as z from "zod";

import type { formSchema } from "./schema";

const MemberForm = () => {
  const form = useFormContext<z.infer<typeof formSchema>>();
  const { setValue, watch } = form;
  const tags = watch("members")?.map((member) => ({
    id: member.id,
    text: member.text,
  }));

  return (
    <FormField
      control={form.control}
      name="members"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-left">게임 참여자 이름</FormLabel>
          <FormControl>
            <TagInput
              {...field}
              placeholder="참여자의 이름을 추가해주세요"
              placeholderWhenFull="더 이상 참여자를 추가할 수 없습니다"
              tags={tags}
              borderStyle={"none"}
              truncate={5}
              maxTags={4}
              minTags={1}
              setTags={(newTags) => {
                setValue("members", newTags as [Tag, ...Tag[]]);
              }}
            />
          </FormControl>
          <FormDescription>최대 4명까지 입력 가능합니다</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MemberForm;
