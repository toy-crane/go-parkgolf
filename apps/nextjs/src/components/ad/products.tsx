"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { track } from "@vercel/analytics/react";

import Product from "./product";

interface CoupangProduct {
  name: string;
  url: string;
  category: "globe" | "ball" | "club";
}

const CoupangProducts: CoupangProduct[] = [
  {
    name: "볼빅 콤비 크리스탈 로스트볼 S급 12개 소량입고, 1개",
    url: "https://coupa.ng/ce93uk",
    category: "ball",
  },
  {
    name: "아식스 파크골프 공 이도류 4피스 3283A102, 옐로우, 1개, 1개",
    url: "https://coupa.ng/ce93vG",
    category: "ball",
  },
  {
    name: "부쿠로혼마 대한파크골프협회 인증 골프용품 골프공 인증공 파크골프공, 네온, 1개입, 1개",
    url: "https://coupa.ng/ce93ws",
    category: "ball",
  },
  {
    name: "하타치 SHINE 파크 골프공 볼 2피스 6cm PH3400, 빨간색, 1개입, 1개",
    url: "https://coupa.ng/ce93w8",
    category: "ball",
  },
  {
    name: "하타치 SHINE 파크 골프공 볼 2피스 6cm PH3400, 형광색, 1개입, 1개",
    url: "https://coupa.ng/ce93xm",
    category: "ball",
  },
];

const Products = () => {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-col">
        <h2 className="text-foreground text-xl font-bold">
          파크골프 용품이 필요하다면 🏌️‍♂️
        </h2>
      </div>
      <Tabs
        defaultValue="globe"
        onValueChange={(value) => track(`${value}-products-clicked`)}
      >
        <TabsList className="flex justify-start gap-0 bg-white">
          <TabsTrigger
            value="globe"
            className="text-muted-foreground data-[state=active]:bg-muted flex h-7 items-center justify-center rounded-full px-3 px-3 text-center text-sm transition-colors hover:font-bold data-[state=active]:font-bold data-[state=active]:text-black"
          >
            파크골프 장갑
          </TabsTrigger>
          <TabsTrigger
            value="ball"
            className="text-muted-foreground data-[state=active]:bg-muted flex h-7 items-center justify-center rounded-full px-3 px-3 text-center text-sm transition-colors hover:font-bold data-[state=active]:font-bold data-[state=active]:text-black"
          >
            파크골프공
          </TabsTrigger>
          <TabsTrigger
            value="club"
            className="text-muted-foreground data-[state=active]:bg-muted flex h-7 items-center justify-center rounded-full px-3 px-3 text-center text-sm transition-colors hover:font-bold data-[state=active]:font-bold data-[state=active]:text-black"
          >
            파크골프채
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ball">
          <ScrollArea className="max-w-[600px] lg:max-w-none">
            <div className="flex gap-1 pb-2">
              {CoupangProducts.filter(
                (product) => product.category === "ball",
              ).map((pr) => (
                <Product key={pr.url} title={pr.name} url={pr.url} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="club">
          <ScrollArea className="max-w-[600px] lg:max-w-none">
            <div className="flex gap-1 pb-2">
              <iframe
                className="w-full min-w-[120px]"
                src="https://coupa.ng/ce92OO"
                width="120"
                height="240"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
              ></iframe>
              <iframe
                src="https://coupa.ng/ce92Ut"
                className="w-full min-w-[120px]"
                width="120"
                height="240"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
              ></iframe>
              <iframe
                src="https://coupa.ng/ce92Ve"
                className="w-full min-w-[120px]"
                width="120"
                height="240"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
              ></iframe>
              <iframe
                src="https://coupa.ng/ce92Wq"
                className="w-full min-w-[120px]"
                width="120"
                height="240"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
              ></iframe>
              <iframe
                src="https://coupa.ng/ce92WB"
                className="w-full min-w-[120px]"
                width="120"
                height="240"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
              ></iframe>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="globe">
          <ScrollArea className="max-w-[600px] lg:max-w-none">
            <div className="flex gap-1 pb-2">
              <iframe
                src="https://coupa.ng/ce93yD"
                className="w-full min-w-[120px]"
                width="120"
                height="240"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
              ></iframe>
              <iframe
                src="https://coupa.ng/ce93zk"
                className="w-full min-w-[120px]"
                width="120"
                height="240"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
              ></iframe>
              <iframe
                src="https://coupa.ng/ce93zD"
                className="w-full min-w-[120px]"
                width="120"
                height="240"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
              ></iframe>
              <iframe
                src="https://coupa.ng/ce93zQ"
                className="w-full min-w-[120px]"
                width="120"
                height="240"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
              ></iframe>
              <iframe
                src="https://coupa.ng/ce93Af"
                className="w-full min-w-[120px]"
                width="120"
                height="240"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
              ></iframe>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
      </Tabs>
      <div className="flex justify-center text-[8px] text-slate-500">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
        제공받습니다.
      </div>
    </section>
  );
};

export default Products;
