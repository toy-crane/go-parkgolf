import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/tailwind";
import { Delete } from "lucide-react";

const ScoresInput = ({
  inputLength,
  onSubmit,
  onChange,
  defaultScores,
  label,
}: {
  label: React.ReactNode;
  defaultScores: { id: string; score: string; nickname: string }[];
  inputLength: number;
  onChange: (scores: string[]) => void;
  onSubmit: () => void;
}) => {
  const [scoreSet, setScoreSet] =
    useState<{ id: string; score: string; nickname: string }[]>(defaultScores);

  const [currentIndex, setCurrentIndex] = useState(0); // 현재 입력 위치를 추적하는 상태

  const handleClick = (number: number) => {
    const newScoreSet = scoreSet.map((score, index) => {
      if (index === currentIndex) {
        return { ...score, score: number.toString() };
      }
      return score;
    });
    setScoreSet(newScoreSet);
    onChange(newScoreSet.flatMap((set) => set.score));

    const nextIndex = currentIndex + 1; // 다음 위치 계산
    if (nextIndex >= inputLength) {
      // 마지막 인덱스를 초과하는 경우
      onSubmit(); // 모든 입력이 완료되었으므로 onSubmit 호출
      setCurrentIndex(0); // 인덱스를 다시 처음으로 설정
    } else {
      setCurrentIndex(nextIndex); // 아니라면 현재 입력 위치 업데이트
    }
  };
  const handleBack = () => {
    // 현재 모든 값이 "0"이 되었다면 onSubmit 호출
    if (scoreSet.flatMap((set) => set.score).every((value) => value === "0")) {
      onSubmit();
    }
    const newScoreSet = [...scoreSet];
    const currentScoreSet = newScoreSet[currentIndex]!;
    const prevScoreSet = newScoreSet[currentIndex - 1]!;
    const currentScore = currentScoreSet.score;
    if (currentScore !== "0") {
      // 현재 인덱스의 값이 비어있지 않다면 해당 값을 지웁니다.
      currentScoreSet.score = "0";
    } else if (currentIndex > 0) {
      // 현재 인덱스의 값이 비어있고, 현재 인덱스가 0보다 크다면 이전 인덱스의 값을 지웁니다.
      prevScoreSet.score = "0";
      setCurrentIndex(currentIndex - 1); // 인덱스를 이전 위치로 업데이트합니다.
    }
    setScoreSet(newScoreSet);
    onChange(newScoreSet.flatMap((set) => set.score));
  };

  const handleComplete = () => {
    onSubmit();
  };
  return (
    <div>
      <div className="flex flex-col items-center justify-center pb-4">
        <span className="mb-1 text-base font-bold tracking-wide">{label}</span>
        <div className="flex justify-center gap-4">
          {scoreSet.map((set, index) => (
            <div
              className="flex w-9 flex-col gap-1 overflow-hidden"
              key={set.id}
            >
              <button
                className={cn(
                  "relative flex h-5 min-w-[36px] items-center justify-center px-1 text-lg",
                  "after:bg-muted-foreground/40 after:absolute after:bottom-[-4px] after:h-[3px] after:w-full after:content-['']",
                  index === currentIndex &&
                    "after:animate-blink after:absolute after:bottom-[-4px] after:h-[3px] after:w-full after:bg-lime-500 after:content-['']",
                )}
                onClick={() => setCurrentIndex(index)}
              >
                {set.score === "0" ? "" : set.score}
              </button>
              <span
                className={cn(
                  "text-muted-foreground/25 truncate text-center text-[12px]",
                  index === currentIndex && "text-foreground/80 font-semibold",
                )}
              >
                {set.nickname}
              </span>
            </div>
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
            {score + 1} 타
          </Button>
        ))}
        <div className="col-span-2">
          <Button onClick={handleComplete} className="w-full">
            입력 완료
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
