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
      <span className="text-base font-semibold">{label}</span>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href={`/golf-courses/${golfCourseSlug}/reviews/create`}>
            <Frown />
          </Link>
        </Button>
        <Button variant="outline">
          <Meh />
        </Button>
        <Button variant="outline">
          <Smile />
        </Button>
        <Button variant="outline">
          <Laugh />
        </Button>
        <Button variant="outline">
          <SmilePlus />
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
