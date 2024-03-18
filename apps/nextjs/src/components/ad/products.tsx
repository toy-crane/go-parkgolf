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
  {
    name: "휠라골프 극세사 양손용 골프장갑, 화이트",
    url: "https://coupa.ng/ce93yD",
    category: "globe",
  },
  {
    name: "지맥스 1+1 파크골프장갑 PLUS 양손 2세트",
    url: "https://coupa.ng/ce93zk",
    category: "globe",
  },
  {
    name: "땀골프 여성용 논슬립 골프장갑 양손용, 혼합색상",
    url: "https://coupa.ng/ce93zD",
    category: "globe",
  },
  {
    name: "여성용 GH 쿨메쉬 실리콘 골프 양손용, 핑크",
    url: "https://coupa.ng/ce93zQ",
    category: "globe",
  },
  {
    name: "지맥스 남성용 뉴 울트라 파크골프 골프장갑 양손착용, 화이트",
    url: "https://coupa.ng/ce93Af",
    category: "globe",
  },
  {
    name: "프라임 국산4스타 파크골프채 프리미엄 채만, 여성용(520g)",
    url: "https://coupa.ng/ce92OO",
    category: "club",
  },
  {
    name: "데이비드골프 여성용 파크골프채 3종 세트, DP101",
    url: "https://coupa.ng/ce92Ut",
    category: "club",
  },
  {
    name: "알바트로스 A3 파크 골프채 그린",
    url: "https://coupa.ng/ce92Ve",
    category: "club",
  },
  {
    name: "히토미 혼마 여성용 4STAR 감나무헤드 파크골프 클럽 블랙에디션 83cm, R, 90도",
    url: "https://coupa.ng/ce92Wq",
    category: "club",
  },
  {
    name: "라운드파크 여성용 P나인 파크 골프채 네이비 83cm, R, 90도",
    url: "https://coupa.ng/ce92WB",
    category: "club",
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
              {CoupangProducts.filter((pr) => pr.category === "club").map(
                (pr) => (
                  <Product key={pr.url} title={pr.name} url={pr.url} />
                ),
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="globe">
          <ScrollArea className="max-w-[600px] lg:max-w-none">
            <div className="flex gap-1 pb-2">
              {CoupangProducts.filter((pr) => pr.category === "globe").map(
                (pr) => (
                  <Product key={pr.url} title={pr.name} url={pr.url} />
                ),
              )}
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
