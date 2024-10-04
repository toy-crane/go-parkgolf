import { cn } from "@/libs/tailwind";

const DynamicBanner = ({ className }: { className?: string }) => {
  return (
    <iframe
      src="https://ads-partners.coupang.com/widgets.html?id=811706&template=carousel&trackingCode=AF5797213&subId=&width=728&height=90&tsource="
      title="coupang-ad"
      width={728}
      height={150}
      referrerPolicy="unsafe-url"
      className={cn("w-full min-w-[120px] border-0", className)}
    />
  );
};

export default DynamicBanner;
