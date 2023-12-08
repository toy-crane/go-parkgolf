import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { readUserSession } from "@/libs/auth";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "../../../components/page-header";
import KakaoForm from "../auth/components/kakao-form";

const Page = async () => {
  const session = await readUserSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="h-dynamic-screen flex flex-col items-center justify-center">
      <Image
        src="/logo.png"
        width={96}
        height={96}
        alt="Logo"
        className="py-4 align-middle"
      />
      <PageHeader className="items-center pb-12 pt-8 text-center">
        <PageHeaderHeading>파크 골프장의 모든 것</PageHeaderHeading>
        <PageHeaderDescription>
          전국의 모든 파크골프장의 정보를 손쉽게 찾아보세요
        </PageHeaderDescription>
      </PageHeader>
      <div className="mb-6 flex flex-col gap-4">
        <KakaoForm />
      </div>
      <p className="text-muted-foreground px-8 text-center text-sm">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="hover:text-primary text-black underline underline-offset-4"
        >
          로그인
        </Link>
      </p>
    </div>
  );
};

export default Page;
