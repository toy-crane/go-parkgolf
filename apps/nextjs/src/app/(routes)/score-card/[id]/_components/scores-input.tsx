import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const ScoresInput = ({
  inputLength,
  onSubmit,
}: {
  inputLength: number;
  onSubmit: (scores: string[]) => void;
}) => {
  const [scores, setScores] = useState<string[]>(
    new Array(inputLength).fill(""),
  );

  const handleClick = (number: number) => {
    // 현재 입력된 OTP의 길이를 찾고, 그 위치에 숫자를 입력합니다.
    const nextIndex = scores.findIndex((value) => value === "");
    if (nextIndex !== -1) {
      const newScores = [...scores];
      newScores[nextIndex] = number.toString();
      setScores(newScores);
      // 모든 OTP 숫자가 입력되면, 여기에서 추가적인 동작을 수행할 수 있습니다.
      if (newScores.every((num) => num !== "")) {
        onSubmit(newScores);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-center gap-4 pb-4">
        {scores.map((value, index) => (
          <span key={index}>{value || "_"}</span>
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
