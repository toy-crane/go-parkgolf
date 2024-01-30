import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import type { GolfCourse } from "@/types";

import CreateQnAButton from "./create-qna-button";
import QnACard from "./qna-card";

const QnaInfo = async ({ course }: { course: GolfCourse }) => {
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("golf_course_qnas")
    .select("*, profiles(*)")
    .eq("golf_course_id", course.id)
    .order("created_at", {
      ascending: false,
    });

  if (response.error) throw response.error;
  const qnas = response.data;

  return (
    <div className="flex flex-col space-y-2">
      <CreateQnAButton course={course} />
      {qnas
        .filter((qna) => qna.level === 0)
        .map((qna) => {
          const replies = qnas.filter((q) => q.parent_id === qna.id);
          return <QnACard key={qna.id} qna={qna} replies={replies} />;
        })}
    </div>
  );
};

export default QnaInfo;
