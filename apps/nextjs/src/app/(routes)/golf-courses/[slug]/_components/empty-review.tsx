"use client;";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Balancer from "react-wrap-balancer";

const EmptyReview = () => {
  const params = useParams();
  const router = useRouter();
  return (
    <div className="mt-12 flex flex-col items-center justify-center gap-4 md:mt-20">
      <span className="text-center text-lg font-semibold">
        <Balancer>소중한 파크골프가자의 첫 리뷰를 작성해주세요</Balancer>
      </span>
      <Button
        onClick={() =>
          router.push(`/golf-courses/${params.slug as string}/reviews/create`)
        }
      >
        첫 리뷰 등록하기
      </Button>
    </div>
  );
};

export default EmptyReview;
