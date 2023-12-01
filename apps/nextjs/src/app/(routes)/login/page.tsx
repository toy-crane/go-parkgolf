import Link from "next/link";
import { Button } from "@/components/ui/button";

import { PageHeader, PageHeaderHeading } from "../_components/page-header";
import KakaoForm from "../auth/components/kakao-form";

const Page = () => {
  return (
    <div className="flex flex-col">
      <div>로고 위치</div>
      <PageHeader className="relative pb-12 pt-28 md:pt-36">
        <PageHeaderHeading>로그인</PageHeaderHeading>
      </PageHeader>
      <div className="mb-6 flex flex-col gap-4">
        <KakaoForm />
        <Button className="w-full" size="lg">
          다른 방법으로 로그인하기
        </Button>
      </div>
      <p className="text-muted-foreground px-8 text-center text-sm">
        아직 파크골프가자 회원이 아니신가요?{" "}
        <Link
          href="/register"
          className="hover:text-primary text-black underline underline-offset-4"
        >
          회원가입
        </Link>
      </p>
    </div>
  );
};

export default Page;
