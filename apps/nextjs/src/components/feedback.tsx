import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Frown, Laugh, Meh, Smile, SmilePlus } from "lucide-react";

const Feedback = ({
  label,
  golfCourseSlug,
}: {
  label: string;
  golfCourseSlug: string;
}) => {
  return (
    <div className="mb-4 flex flex-col items-center gap-2">
      <span className="text-sm font-semibold md:text-base">{label}</span>
      <div className="flex gap-2">
        <Button variant="outline" asChild className="px-3">
          <Link
            href={`/golf-courses/${golfCourseSlug}/reviews/create?courseConditionRating=1`}
          >
            <Frown />
          </Link>
        </Button>
        <Button variant="outline" asChild className="px-3">
          <Link
            href={`/golf-courses/${golfCourseSlug}/reviews/create?courseConditionRating=2`}
          >
            <Meh />
          </Link>
        </Button>
        <Button variant="outline" asChild className="px-3">
          <Link
            href={`/golf-courses/${golfCourseSlug}/reviews/create?courseConditionRating=3`}
          >
            <Smile />
          </Link>
        </Button>
        <Button variant="outline" asChild className="px-3">
          <Link
            href={`/golf-courses/${golfCourseSlug}/reviews/create?courseConditionRating=4`}
          >
            <Laugh />
          </Link>
        </Button>
        <Button variant="outline" asChild className="px-3">
          <Link
            href={`/golf-courses/${golfCourseSlug}/reviews/create?courseConditionRating=5`}
          >
            <SmilePlus />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
