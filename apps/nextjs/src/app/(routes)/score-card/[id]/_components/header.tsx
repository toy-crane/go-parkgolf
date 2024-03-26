import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import { cn } from "@/libs/tailwind";

import BackButton from "./back-button";
import SaveButton from "./save-button";

const Header = async ({
  gameId,
  isReadOnly,
  isMyGame,
}: {
  gameId: string;
  isReadOnly: boolean;
  isMyGame: boolean;
}) => {
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("games")
    .select("golf_courses(name),user_id, game_players(id)")
    .eq("id", gameId)
    .single();
  if (response.error) throw response.error;
  const courseName = response.data.golf_courses?.name;
  const playerIds = response.data.game_players.map((p) => p.id);
  return (
    <>
      <div className="flex items-center gap-1 py-2">
        <BackButton />
        <div className="flex-auto">
          <h3
            className={cn(
              "flex break-keep text-base font-semibold leading-5 tracking-tight",
            )}
          >
            {courseName ? courseName : null}
          </h3>
        </div>
        {isMyGame ? (
          isReadOnly ? (
            <Button asChild size="sm" className="h-8 px-2">
              <Link href={`/score-card/${gameId}`}>수정하기</Link>
            </Button>
          ) : (
            <div className="flex gap-2">
              <SaveButton
                gameId={gameId}
                playerIds={playerIds}
                temporary={true}
              />
              <SaveButton gameId={gameId} playerIds={playerIds} />
            </div>
          )
        ) : null}
      </div>
    </>
  );
};

export default Header;
