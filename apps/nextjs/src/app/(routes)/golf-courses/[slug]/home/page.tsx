import Products from "@/components/ad/products";
import { Separator } from "@/components/ui/separator";
import { generateFormUrl } from "@/libs/google-form";
import { Pencil } from "lucide-react";

import { getCourse } from "../fetcher";

interface CardProps {
  title: string;
  content: string | React.ReactNode;
}

const Label = ({ title, content }: CardProps) => {
  return (
    <div className="flex items-center">
      <h3 className="mr-4 shrink-0 text-base font-semibold">{title}</h3>
      <div className="text-muted-foreground text-base">{content}</div>
    </div>
  );
};

const InfoNeeded = ({ href }: { href: string }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center"
    >
      <div className="mr-2">정보를 알려주세요.</div>
      <Pencil size={16} />
    </a>
  );
};

const Page = async ({ params }: { params: { slug: string } }) => {
  const course = await getCourse(params.slug);
  const operation = course.operations;
  const phoneNumber = course.phone_number;
  return (
    <div className="min-h-[25vh] space-y-6">
      <div className="flex flex-col gap-1">
        <Label title="위치" content={course.lot_number_address_name} />
      </div>
      <Separator />
      {operation && (
        <>
          <div className="space-y-3">
            <h2 className="text-foreground text-xl font-bold">운영 시간</h2>
            <div className="flex flex-col gap-1">
              <Label
                title="영업시간"
                content={
                  operation?.opening_hours ??
                  InfoNeeded({
                    href: generateFormUrl(course.name),
                  })
                }
              />
              <Label
                title="정기 휴무일"
                content={
                  operation?.regular_closed_days ??
                  InfoNeeded({
                    href: generateFormUrl(course.name),
                  })
                }
              />
            </div>
          </div>
          <Separator />
        </>
      )}
      {phoneNumber && (
        <>
          <div className="space-y-3">
            <h2 className="text-foreground text-xl font-bold">연락처</h2>
            <div className="flex flex-col gap-1">
              <Label
                title="전화번호"
                content={
                  phoneNumber ? (
                    <a href={`tel:${phoneNumber}`} className="text-blue-400">
                      {phoneNumber}
                    </a>
                  ) : (
                    InfoNeeded({
                      href: generateFormUrl(course.name),
                    })
                  )
                }
              />
            </div>
          </div>
          <Separator />
        </>
      )}
      <div className="space-y-3">
        <h2 className="text-foreground mb-2 text-xl font-bold">이용 방법</h2>
        <div className="flex flex-col gap-1">
          <Label
            title="예약 방법"
            content={
              operation?.registration_method ??
              InfoNeeded({
                href: generateFormUrl(course.name),
              })
            }
          />
          <Label
            title="홈페이지"
            content={
              operation?.website ? (
                <a href={operation?.website} className="text-blue-400">
                  상세 페이지 바로가기
                </a>
              ) : (
                InfoNeeded({
                  href: generateFormUrl(course.name),
                })
              )
            }
          />
        </div>
      </div>
      <Separator />
      <div className="space-y-3">
        <Products />
      </div>
    </div>
  );
};

export default Page;
