import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseServerClient } from "@/libs/supabase/server";
import { cn } from "@/libs/tailwind";
import { format } from "date-fns";

const ScoreCard = async ({ gameId }: { gameId: string }) => {
  const supabase = await createSupabaseServerClient();
  const response = await supabase
    .from("games")
    .select("started_at, game_courses(*)")
    .eq("id", gameId)
    .single();
  if (response.error) throw response.error;
  const { started_at, game_courses: gameCourses } = response.data;

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
            {gc.name} 코스
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default ScoreCard;
