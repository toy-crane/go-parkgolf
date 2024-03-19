import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseServerClient } from "@/libs/supabase/server";
import { cn } from "@/libs/tailwind";
import { format } from "date-fns";

const gridColumns = {
  "1": "grid-cols-score-card-1",
  "2": "grid-cols-score-card-2",
  "3": "grid-cols-score-card-3",
  "4": "grid-cols-score-card-4",
};

const ScoreCardHead = ({
  label,
  className,
}: {
  label: string;
  className?: string;
}) => {
  return (
    <TableHead
      className={cn(
        "flex h-auto items-center justify-center border px-0 py-2 text-center font-semibold text-black md:px-4",
        className,
      )}
    >
      {label}
    </TableHead>
  );
};

const ScoreCard = async ({ gameId }: { gameId: string }) => {
  const supabase = await createSupabaseServerClient();
  const response = await supabase
    .from("games")
    .select("started_at, game_courses(*), game_players(id, nickname)")
    .eq("id", gameId)
    .single();
  if (response.error) throw response.error;
  const {
    started_at,
    game_courses: gameCourses,
    game_players: players,
  } = response.data;

  return (
    <section>
      <div
        className={cn("text-muted-foreground flex justify-end pb-1 text-xs")}
      >
        {started_at && format(new Date(started_at), "yyyy-MM-dd")}
      </div>
      <Tabs defaultValue={gameCourses[0]?.name} className="flex flex-col">
        <TabsList className="h-7">
          {gameCourses.map((gc) => (
            <TabsTrigger
              value={gc.name}
              key={gc.id}
              className="flex-1 py-0.5 text-xs"
            >
              {gc.name} 코스
            </TabsTrigger>
          ))}
        </TabsList>
        {gameCourses.map((gc) => (
          <TabsContent value={gc.name} key={gc.id} className="flex-1">
            <Table className="flex h-full flex-1 flex-col text-xs md:text-sm">
              <TableHeader className="flex-0">
                <TableRow
                  className={cn(
                    "align-center grid",
                    gridColumns[
                      String(players.length) as keyof typeof gridColumns
                    ],
                  )}
                >
                  <ScoreCardHead label="홀" className="bg-lime-200" />
                  <ScoreCardHead label="파" className="bg-lime-400" />
                  {players.map((player) => (
                    <ScoreCardHead key={player.id} label={player.nickname} />
                  ))}
                </TableRow>
              </TableHeader>
            </Table>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default ScoreCard;
