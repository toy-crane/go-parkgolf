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
    redirect("/");
  }

  return (
    <div className="mt-10 flex flex-col justify-center md:mt-20">
      <Image
        src="/logo.png"
        width={96}
        height={96}
        alt="Logo"
        className="self-items-center self-center pt-4"
      />
      <PageHeader className="pb-6 md:pb-12">
        <PageHeaderHeading className="self-center">
          파크골프 가자
        </PageHeaderHeading>
        <PageHeaderDescription className="self-center text-center leading-tight">
          파크 골프장 검색,
          <br className="md:hidden" /> 스코어 기록까지 한번에!
        </PageHeaderDescription>
      </PageHeader>
      <div className="mb-2 flex flex-col gap-4">
        <KakaoForm label="카카오로 3초만에 시작하기" />
      </div>
      <p className="text-muted-foreground px-8 text-center text-sm">
        <Link
          href={`/login?${new URLSearchParams(searchParams).toString()}`}
          replace
          className="hover:text-primary text-muted-foreground text-xs underline underline-offset-4"
        >
          로그인
        </Link>
      </p>
    </div>
  );
};

export default Page;
