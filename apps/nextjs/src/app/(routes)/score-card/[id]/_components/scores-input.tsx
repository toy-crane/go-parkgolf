import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/tailwind";
import { LucideArrowLeft } from "lucide-react";

// 점수 입력 컴포넌트
// 요구사항
// index는 항상 맨 앞에 제일 앞에 위치한다.

const ScoresInput = ({
  inputLength,
  onSubmit,
  defaultScores,
}: {
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

    // 모든 값이 "0"이 되었다면 onSubmit 호출
    if (newScores.every((value) => value === "0")) {
      onSubmit(newScores);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center pb-4">
        <span className="text-lg font-bold">5홀</span>
        <div className="flex justify-center gap-4">
          {scores.map((value, index) => (
            <button
              key={index}
              className={cn(
                index === currentIndex && "underline underline-offset-4",
              )}
              onClick={() => setCurrentIndex(index)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* 백 버튼 추가 */}
      <div className="mb-2 grid grid-cols-3 gap-1">
        {[...Array(9).keys()].map((score, index) => (
          <Button
            key={index}
            variant={"secondary"}
            onClick={() => handleClick(score + 1)}
          >
            {score + 1}
          </Button>
        ))}
        <div className="col-span-1"></div> {/* 첫 번째 빈 셀 */}
        <div className="col-span-1"></div> {/* 두 번째 빈 셀 */}
        <div className="col-span-1">
          <Button variant="secondary" onClick={handleBack} className="w-full">
            <LucideArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScoresInput;
