import { createSupabaseServerClient } from "@/libs/supabase/server";
import { cn } from "@/libs/tailwind";
import { format } from "date-fns";

const ScoreCard = async ({ gameId }: { gameId: string }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const supabase = await createSupabaseServerClient();
  const response = await supabase
    .from("games")
    .select("started_at")
    .eq("id", gameId)
    .single();
  if (response.error) throw response.error;
  const { started_at } = response.data;
  return (
    <section>
      <div
        className={cn("text-muted-foreground flex justify-end pb-1 text-xs")}
      >
        {started_at && format(new Date(started_at), "yyyy-MM-dd")}
      </div>
    </section>
  );
};

export default ScoreCard;
