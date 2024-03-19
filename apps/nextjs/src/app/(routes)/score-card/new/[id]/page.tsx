import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";

import Header from "./_components/header";
import ScoreCard from "./_components/score-card";

const Page = ({ params }: { params: { id: string } }) => {
  const gameId = params.id;

  return (
    <>
      <Header gameId={gameId} />
      <Suspense
        fallback={
          <div className="flex min-h-[80vh] items-center justify-center">
            <Loader2
              className="h-5 w-5 animate-spin"
              size={24}
              color={"#71717A"}
            />
          </div>
        }
      >
        <ScoreCard gameId={gameId} />
      </Suspense>
    </>
  );
};

export default Page;
