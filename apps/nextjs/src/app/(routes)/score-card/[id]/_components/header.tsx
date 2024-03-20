import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/libs/supabase/server";
import { cn } from "@/libs/tailwind";

import BackButton from "./back-button";
import SaveButton from "./save-button";

const Header = async ({ gameId }: { gameId: string }) => {
  const supabase = await createSupabaseServerClient();
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
        <div className="flex gap-2">
          <SaveButton gameId={gameId} playerIds={playerIds} temporary={true} />
          <SaveButton gameId={gameId} playerIds={playerIds} />
        </div>
      </div>
    </>
  );
};

export default Header;
