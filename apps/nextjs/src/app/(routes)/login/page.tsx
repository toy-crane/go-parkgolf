import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { readUserSession } from "@/libs/auth";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "../../../components/page-header";
import KakaoForm from "../auth/_components/kakao-form";

const Page = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const session = await readUserSession();

  if (session) {
    return redirect("/");
  }

  return (
    <div className="mt-10 flex flex-col justify-center md:mt-20">
      <Image
        src="/logo.png"
        width={96}
        height={96}
        alt="Logo"
        className="self-items-center self-center pt-4"
        placeholder="blur"
        blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
      />
      <PageHeader className="pb-6 md:pb-12">
        <PageHeaderHeading className="self-center">
          파크골프 가자
        </PageHeaderHeading>
        <PageHeaderDescription className="self-center text-center text-xl tracking-tight">
          지금 가입하면 <br />
          스코어 기록 무제한!
          <br />
          <span className="text-xs">
            파크골프 가자 회원만의 혜택을 누려보세요
          </span>
        </PageHeaderDescription>
      </PageHeader>
      <div className="mb-2 flex flex-col gap-4">
        <KakaoForm label="카카오로 3초만에 시작하기" />
      </div>
    </div>
  );
};

export default Page;
