"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
        404 Error
      </h1>
      <p className="mb-8 mt-4 text-center text-lg text-gray-600 dark:text-gray-400">
        요청하신 페이지를 찾을 수 없습니다. <br />
        입력하신 주소가 정확한지 다시 한번 확인해주세요.
      </p>
      <Button onClick={() => router.back()}>이전 페이지로 돌아가기</Button>
    </div>
  );
}
