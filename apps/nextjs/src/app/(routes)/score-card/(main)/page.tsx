import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

import CTA from "./_components/cta";

const Page = () => {
  return (
    <div>
      <section className="w-full pb-12 pt-20 md:pb-28 md:pt-24 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-8">
          <div className="space-y-4">
            <div className="space-y-2 text-center">
              <h1 className="break-keep text-3xl font-bold tracking-tighter sm:text-5xl">
                파크골프 스코어 카드
              </h1>
              <p className="mx-auto max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed">
                스마트폰으로 쉽고 간편하게! <br /> 스코어 카드를 작성해보세요.
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl items-center justify-center gap-4">
              <Image
                alt="score-card"
                src={"/landing/score-card.png"}
                className="rounded-md border border-gray-200 p-2"
                width="480"
                height="480"
                placeholder="blur"
                blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAcAAA0ACbYD1v4AAAAASUVORK5CYII=
                "
              />
            </div>
          </div>
          <div className="flex flex-col justify-center gap-3 text-base font-semibold md:items-center md:gap-5 md:text-lg">
            <div className="inline-flex items-center">
              <span className="mr-3">💾</span> 실력 향상을 위한 기록 관리를 내
              핸드폰에서
            </div>
            <div className="inline-flex items-center">
              <span className="mr-3">👬</span>주변 동료들과 빠르게 게임 결과를
              공유
            </div>
            <div className="inline-flex items-center">
              <span className="mr-3">⛳</span>
              전국 100여개의 파크골프장 코스 자동 입력
            </div>
          </div>
          <Separator />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">자주 묻는 질문</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  최대 몇 명까지 기록이 가능한가요?
                </AccordionTrigger>
                <AccordionContent>
                  한 게임당 최대 4명까지 기록이 가능합니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>코스가 등록되어 있지 않아요</AccordionTrigger>
                <AccordionContent>
                  현재 전국 100여개의 파크골프장 코스가 등록되어 있습니다.
                  계속해서 코스를 추가하고 있는 중입니다. 빠르게 추가되었으면
                  하는 코스가 있다면, 아래 링크로 요청해주세요.
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSefrWOE4gGzpWu-6MkRTsIYKUYCyWt1eoaplQb_huGJ7zfkqg/viewform?usp=pp_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 inline-flex items-center text-gray-500 underline"
                  >
                    링크
                  </a>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>코스 정보가 잘못되어 있어요</AccordionTrigger>
                <AccordionContent>
                  코스 정보가 잘못 등록되어 있다면, 아래 링크를 통해 수정을
                  요청해 주세요. 빠르게 수정하도록 하겠습니다.
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSefrWOE4gGzpWu-6MkRTsIYKUYCyWt1eoaplQb_huGJ7zfkqg/viewform?usp=pp_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 inline-flex items-center text-gray-500 underline"
                  >
                    링크
                  </a>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>아이폰 앱은 없나요?</AccordionTrigger>
                <AccordionContent>
                  아쉽지만, 현재는 안드로이드에서만 지원이 가능합니다. 아래
                  링크를 통해서 아이폰 앱 개발 요청을 주시면 우선순위를 반영하여
                  최대한 빠르게 개발을 진행하도록 하겠습니다.
                  <a
                    href="https://forms.gle/xC2Y9LtjrD1Uhj5r9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 inline-flex items-center text-gray-500 underline"
                  >
                    링크
                  </a>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
      <div className="bottom-cta content-grid bg-gradient-to-t from-white from-80% to-transparent">
        <div className="content pt-5">
          <CTA />
        </div>
      </div>
    </div>
  );
};

export default Page;
