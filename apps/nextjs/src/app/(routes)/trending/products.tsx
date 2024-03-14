import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Products = () => {
  return (
    <section className="flex flex-col gap-2 pb-16">
      <h2 className="text-foreground text-xl font-bold">추천 TOP 5 🏆</h2>
      <Tabs defaultValue="club">
        <TabsList className="flex justify-start gap-0 bg-white">
          <TabsTrigger
            value="club"
            className="text-muted-foreground data-[state=active]:bg-muted flex h-7 items-center justify-center rounded-full px-3 px-3 text-center text-sm transition-colors hover:font-bold data-[state=active]:font-bold data-[state=active]:text-black"
          >
            파크골프채
          </TabsTrigger>
          <TabsTrigger
            value="ball"
            className="text-muted-foreground data-[state=active]:bg-muted flex h-7 items-center justify-center rounded-full px-3 px-3 text-center text-sm transition-colors hover:font-bold data-[state=active]:font-bold data-[state=active]:text-black"
          >
            파크골프공
          </TabsTrigger>
          <TabsTrigger
            value="globe"
            className="text-muted-foreground data-[state=active]:bg-muted flex h-7 items-center justify-center rounded-full px-3 px-3 text-center text-sm transition-colors hover:font-bold data-[state=active]:font-bold data-[state=active]:text-black"
          >
            파크골프 장갑
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ball">
          <ScrollArea className="max-w-[600px] lg:max-w-none">
            <div className="flex gap-1 pb-2">
              <iframe
                src="https://coupa.ng/ce93uk"
                className="w-full min-w-[120px]"
                width="120"
                height="240"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
              ></iframe>
              <iframe
                src="https://coupa.ng/ce93vG"
                className="w-full min-w-[120px]"
                width="120"
                height="240"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
              ></iframe>
              <iframe
                src="https://coupa.ng/ce93ws"
                className="w-full min-w-[120px]"
                width="120"
                height="240"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
              ></iframe>

              <iframe
                src="https://coupa.ng/ce93w8"
                className="w-full min-w-[120px]"
                width="120"
                height="240"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
              ></iframe>
              <iframe
                src="https://coupa.ng/ce93xm"
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
