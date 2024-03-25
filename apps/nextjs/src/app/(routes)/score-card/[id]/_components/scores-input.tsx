import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/tailwind";

const ScoresInput = ({
  inputLength,
  onSubmit,
  defaultScores,
}: {
  defaultScores?: string[];
  inputLength: number;
  onSubmit: (scores: string[]) => void;
}) => {
  const [scores, setScores] = useState<string[]>(
    defaultScores ?? Array(inputLength).fill(""),
  );

  const [currentIndex, setCurrentIndex] = useState(0); // 현재 입력 위치를 추적하는 상태

  const handleClick = (number: number) => {
    const newScores = [...scores];
    newScores[currentIndex] = number.toString(); // 현재 위치에 숫자 할당
    setScores(newScores);

    const nextIndex = currentIndex + 1; // 다음 위치 계산
    if (nextIndex >= inputLength) {
      // 마지막 인덱스를 초과하는 경우
      onSubmit(newScores); // 모든 입력이 완료되었으므로 onSubmit 호출
      setCurrentIndex(0); // 인덱스를 다시 처음으로 설정
    } else {
      setCurrentIndex(nextIndex); // 아니라면 현재 입력 위치 업데이트
    }
  };

  return (
    <div>
      <div className="flex justify-center gap-4 pb-4">
        {scores.map((value, index) => (
          <button
            key={index}
            className={cn(
              index === currentIndex && "underline underline-offset-4",
            )}
            onClick={() => setCurrentIndex(index)}
          >
            {value || "_"}
          </button>
        ))}
      </div>
      <div className="mb-2 grid grid-cols-3 gap-2">
        {[...Array(9).keys()].map((score, index) => (
          <Button
            key={index}
            variant={"secondary"}
            onClick={() => handleClick(score + 1)}
          >
            {score + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ScoresInput;
