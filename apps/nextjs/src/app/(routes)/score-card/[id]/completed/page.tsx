"use client";

import ResultTable from "./_components/result-table";

const Page = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-8">
        <div className="mt-6 space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-gray-500">
            성주 피닉스 파크골프장
          </h1>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
            게임을 완료했어요!
          </h1>
        </div>
        <div>
          <ResultTable />
        </div>
      </div>
    </>
  );
};

export default Page;
