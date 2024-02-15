"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, LocateFixed } from "lucide-react";

const CurrentPositionButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <Button
      variant="secondary"
      size="smIcon"
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
