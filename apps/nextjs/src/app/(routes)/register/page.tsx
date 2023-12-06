import Link from "next/link";

import { PageHeader, PageHeaderHeading } from "../_components/page-header";
import KakaoForm from "../auth/components/kakao-form";

const Page = () => {
  return (
    <div className="flex flex-col">
      <div>로고 위치</div>
      <PageHeader className="relative pb-12 pt-28 md:pt-36">
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
