"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import type { Tables } from "@/types/supabase-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStepper } from "headless-stepper";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "../../_components/page-header";
import { createGame } from "./_actions";
import CourseForm from "./forms/course-form";
import GameForm from "./forms/game-form";
import ParticipantForm from "./forms/participant-form";
import { formSchema, gameSchema, participantSchema } from "./forms/schema";

const steps = [
  {
    label: "신규 게임 생성하기",
    description: "골프장과 게임 시작 날짜를 입력해 주세요",
    fields: Object.keys(gameSchema.shape),
  },
  {
    label: "신규 게임 생성하기",
    description: "플레이어들의 이름을 입력해 주세요",
    fields: Object.keys(participantSchema.shape),
  },
  {
    label: "신규 게임 생성하기",
    description: "코스를 설정해 주세요",
    fields: Object.keys(participantSchema.shape),
  },
];

interface CreateFormProps {
  courses: Tables<"golf_course">[];
}

type Inputs = z.infer<typeof formSchema>;
type FieldName = keyof Inputs;

const Funnel = ({ courses }: CreateFormProps) => {
  const { state, nextStep, prevStep } = useStepper({ steps });
  const currentStep = state.currentStep;

  const form = useForm<Inputs>({
    shouldUnregister: false,
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: { startDate: new Date(), participants: [] },
  });
  const { trigger } = form;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const result = await createGame(values);
    console.log(result);
  }

  const handleNextClick = async () => {
    const fields = steps[currentStep]?.fields;
    const isValid = await trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (!isValid) return;
    if (state.hasNextStep) {
      nextStep();
    } else {
      await form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div>
      <PageHeader className="relative pb-4 md:pb-8">
        <PageHeaderHeading>{steps[state.currentStep]?.label}</PageHeaderHeading>
        <PageHeaderDescription>
          {steps[state.currentStep]?.description}
        </PageHeaderDescription>
      </PageHeader>
      <Separator className="mb-8 md:mb-10" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-12"
        >
          {currentStep === 0 && <CourseForm courses={courses} />}
          {currentStep === 1 && <ParticipantForm />}
          {currentStep === 2 && <GameForm />}
        </form>
      </Form>
      <div className="flex flex-col gap-4 md:flex-row">
        {state.hasPreviousStep && (
          <Button onClick={prevStep} variant="secondary" size="lg">
            이전 단계로
          </Button>
        )}
        <Button onClick={handleNextClick} size="lg">
          {state.hasNextStep ? "다음 단계로" : "게임 생성하기"}
        </Button>
      </div>
    </div>
  );
};

export default Funnel;
