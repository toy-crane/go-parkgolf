import Products from "@/components/ad/products";
import { Separator } from "@/components/ui/separator";
import { generateFormUrl } from "@/libs/google-form";
import { createSupabaseServerClientReadOnly } from "@/libs/supabase/server";
import type { GolfCourse } from "@/types";
import { Pencil } from "lucide-react";

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
  const slug = decodeURIComponent(params.slug);
  const supabase = await createSupabaseServerClientReadOnly();
  const response = await supabase
    .from("golf_courses")
    .select("*, operations(*), contacts(*)")
    .eq("publish_status", "completed")
    .eq("slug", slug)
    .returns<GolfCourse[]>()
    .single();
  if (response.error) throw Error(response.error.message);
  const course = response.data;
  const operation = course.operations;
  const contacts = course.contacts;
  return (
    <section className="content-grid min-h-[25vh] space-y-6">
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
      {contacts && contacts.length > 0 && (
        <>
          {contacts?.map((contact) => (
            <div className="space-y-3" key={contact.id}>
              <h2 className="text-foreground text-xl font-bold">연락처</h2>
              <div className="flex flex-col gap-1">
                <Label
                  title="전화번호"
                  content={
                    contact?.phone_number ? (
                      <a
                        href={`tel:${contact?.phone_number}`}
                        className="text-blue-400"
                      >
                        {contact?.phone_number}
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
          ))}
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
    </section>
  );
};

export default Page;
