import Link from "next/link";
import DynamicBanner from "@/components/ad/dynamic-banner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { PageHeader, PageHeaderHeading } from "../../../components/page-header";
import { getMyGames } from "./fetcher";
import GameCard from "./game-card";

// 스코어 카드에서 뒤로 가기 시에 refresh를 하기위해 revalidate를 0으로 설정
const revaildate = 0;

const Page = async () => {
  const games = await getMyGames();
  const hasGames = games && games?.length > 0;

  return (
    <section className="flex min-h-[calc(100vh-var(--bottom-nav-height))] flex-col">
      <div className="flex-grow">
        <PageHeader className="relative flex flex-row items-center justify-between pb-4 md:pb-8">
          <PageHeaderHeading className="underline decoration-[#22DC48] decoration-4 underline-offset-[10px]">
            스코어 카드
          </PageHeaderHeading>
          <Button size="sm" asChild>
            {hasGames && (
              <Link href="score-card/create/golf-course">
                <Plus className="mr-1 h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden md:block">게임 추가하기</span>
                <span className="md:hidden">추가하기</span>
              </Link>
            )}
          </Button>
        </PageHeader>
        <div>
          {hasGames ? (
            <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-2">
              {games?.map((game) => <GameCard game={game} key={game.id} />)}
            </div>
          ) : (
            <div className="mt-20 flex flex-col items-center justify-center gap-6 md:mt-24">
              <span className="text-center text-3xl font-bold leading-snug md:text-5xl md:leading-snug">
                쉽고 빠르게 <br />
                스코어를 기록하고 <br />
                주변에 공유해 보세요
              </span>
              <Button size="lg" asChild>
                <Link href="score-card/create/golf-course">
                  <Plus className="mr-2 h-5 w-5" size={24} />
                  신규 게임 추가하기
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      <DynamicBanner className="mb-4" />
    </section>
  );
};

export default Page;
