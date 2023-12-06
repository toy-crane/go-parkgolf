"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAmplitude } from "@/libs/amplitude";
import { Loader2, LocateFixed } from "lucide-react";

const CurrentPositionButton = () => {
  const [loading, setLoading] = useState(false);
  const { track } = useAmplitude();
  const router = useRouter();
  return (
    <Button
      variant="secondary"
      size="icon"
      className="z-header absolute right-0 top-[calc(var(--header-height)+2px)] flex-shrink-0"
      onClick={() => {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLoading(false);
            router.replace(
              `/?${new URLSearchParams({
                lat: String(position.coords.latitude),
                lng: String(position.coords.longitude),
              }).toString()}`,
            );
          },
          () => alert("위치 정보를 가져오는데 실패했습니다."),
          {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000,
          },
        );
        track("current position clicked");
      }}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" size={24} />
      ) : (
        <LocateFixed size={24} />
      )}
    </Button>
  );
};

export default CurrentPositionButton;
