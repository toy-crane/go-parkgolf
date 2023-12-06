import Link from "next/link";
import { redirect } from "next/navigation";
import { readUserSession } from "@/libs/auth";

import { PageHeader, PageHeaderHeading } from "../_components/page-header";
import KakaoForm from "../auth/components/kakao-form";

const Page = async () => {
  const { data } = await readUserSession();

  if (data.session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col">
      <PageHeader className="relative pb-12 pt-6 md:pt-12">
        <PageHeaderHeading>회원가입</PageHeaderHeading>
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
