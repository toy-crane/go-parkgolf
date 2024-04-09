import { notFound } from "next/navigation";
import { get } from "lodash";

import { getCourse } from "../fetcher";
import CTA from "./cta";

const ScoreCardCTA = async ({ slug }: { slug: string }) => {
  const currentCourse = await getCourse(slug);
  if (currentCourse === undefined) return notFound();
  return (
    <div className="content-grid">
      <div className="z-bottom-nav content-grid fixed bottom-[var(--bottom-nav-height)] w-full justify-center bg-gradient-to-t from-white from-80% to-transparent pb-3">
        <div className="md:content full flex justify-center pt-5">
          <CTA courseId={currentCourse.id} courseName={currentCourse.name} />
        </div>
      </div>
    </div>
  );
};

export default ScoreCardCTA;
