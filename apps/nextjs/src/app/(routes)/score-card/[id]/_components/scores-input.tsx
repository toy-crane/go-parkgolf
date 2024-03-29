import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/tailwind";
import { Delete, LucideArrowLeft } from "lucide-react";

const ScoresInput = ({
  inputLength,
  onSubmit,
  defaultScores,
  label,
}: {
  label: string;
  defaultScores: string[];
  inputLength: number;
  onSubmit: (scores: string[]) => void;
}) => {
  const [scores, setScores] = useState<string[]>(defaultScores);

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
  const handleBack = () => {
    // 현재 모든 값이 "0"이 되었다면 onSubmit 호출
    if (scores.every((value) => value === "0")) {
      onSubmit(scores);
    }
    const newScores = [...scores];
    if (newScores[currentIndex] !== "0") {
      // 현재 인덱스의 값이 비어있지 않다면 해당 값을 지웁니다.
      newScores[currentIndex] = "0";
    } else if (currentIndex > 0) {
      // 현재 인덱스의 값이 비어있고, 현재 인덱스가 0보다 크다면 이전 인덱스의 값을 지웁니다.
      newScores[currentIndex - 1] = "0";
      setCurrentIndex(currentIndex - 1); // 인덱스를 이전 위치로 업데이트합니다.
    }
    setScores(newScores);
  };

  const handleComplete = () => {
    onSubmit(scores);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center pb-4">
        <span className="mb-1 text-base font-bold">{label}</span>
        <div className="flex justify-center gap-4">
          {scores.map((value, index) => (
            <button
              key={index}
              className={cn(
                "relative flex h-5 w-5 items-center justify-center px-1 text-lg",
                "after:bg-muted-foreground/40 after:absolute after:bottom-[-4px] after:h-[3px] after:w-full after:content-['']",
                index === currentIndex &&
                  "after:animate-blink after:absolute after:bottom-[-4px] after:h-[3px] after:w-full after:bg-lime-500 after:content-['']",
              )}
              onClick={() => setCurrentIndex(index)}
            >
              {value === "0" ? " " : value}
            </button>
          ))}
        </div>
      </div>

      {/* 백 버튼 추가 */}
      <div className="mb-2 grid grid-cols-3 gap-1 gap-y-1.5">
        {[...Array(9).keys()].map((score, index) => (
          <Button
            key={index}
            variant={"secondary"}
            onClick={() => handleClick(score + 1)}
          >
            {score + 1}
          </Button>
        ))}
        <div className="col-span-2">
          <Button onClick={handleComplete} className="w-full">
            완료
          </Button>
        </div>{" "}
        <div className="col-span-1">
          <Button onClick={handleBack} className="w-full">
            <Delete className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScoresInput;
