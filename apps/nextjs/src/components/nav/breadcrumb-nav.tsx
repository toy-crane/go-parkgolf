import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  trail: { title: string; link: string }[];
  className?: string;
}

const BreadcrumbNav = ({ className, trail }: Props) => {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {trail.map(({ title, link }, index) => (
          <Fragment key={link}>
            {/* 마지막 객체가 아닌 경우에만 BreadcrumbItem과 BreadcrumbSeparator를 렌더링 */}
            {index < trail.length - 1 && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href={link}>{title}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {/* 마지막 객체인 경우에만 BreadcrumbPage를 렌더링 */}
            {index === trail.length - 1 && (
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
