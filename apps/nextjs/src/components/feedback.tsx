import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Frown, Laugh, Meh, Smile, SmilePlus } from "lucide-react";

const Feedback = ({
  label,
  golfCourseId,
}: {
  label: string;
  golfCourseId: string;
}) => {
  return (
    <div className="mb-4 flex flex-col items-center gap-2">
      <span className="text-sm font-semibold md:text-base">{label}</span>
      <div className="flex gap-2">
        <Button variant="outline" asChild className="px-3">
          <Link
            href={`/golf-courses/review/create?courseConditionRating=1&id=${golfCourseId}`}
          >
            <Frown />
          </Link>
        </Button>
        <Button variant="outline" asChild className="px-3">
          <Link
            href={`/golf-courses/review/create?courseConditionRating=2&id=${golfCourseId}`}
          >
            <Meh />
          </Link>
        </Button>
        <Button variant="outline" asChild className="px-3">
          <Link
            href={`/golf-courses/review/create?courseConditionRating=3&id=${golfCourseId}`}
          >
            <Smile />
          </Link>
        </Button>
        <Button variant="outline" asChild className="px-3">
          <Link
            href={`/golf-courses/review/create?courseConditionRating=4&id=${golfCourseId}`}
          >
            <Laugh />
          </Link>
        </Button>
        <Button variant="outline" asChild className="px-3">
          <Link
            href={`/golf-courses/review/create?courseConditionRating=5&id=${golfCourseId}`}
          >
            <SmilePlus />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
