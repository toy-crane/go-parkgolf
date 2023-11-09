import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CommandMenu } from "@/components/command-menu";
import { Button } from "@/components/ui/button";
import { DEFAULT_POSITION } from "@/config/map";
import { useAmplitude } from "@/libs/amplitude";
import { LocateFixed } from "lucide-react";

interface HeaderProps {
  options: { title: string; href: string }[];
}

const Header = ({ options }: HeaderProps) => {
  const { track } = useAmplitude();
  const router = useRouter();

  return (
    <header className="fixed left-0 right-0 top-0 z-30 px-3 pt-3">
      <nav className="flex justify-between gap-2">
        <div className="flex flex-grow gap-2 md:flex-grow-0">
          <Link
            href={`?${new URLSearchParams({
              lat: String(DEFAULT_POSITION.center.lat),
              lng: String(DEFAULT_POSITION.center.lng),
              level: String(DEFAULT_POSITION.level),
            }).toString()}`}
            className="flex-shrink-0 self-center"
          >
            <Image
              src="/logo.png"
              width={32}
              height={32}
              alt="Logo"
              className="align-middle"
            />
          </Link>
          <CommandMenu options={options} />
        </div>

        <Button
          variant="secondary"
          size="icon"
          className="flex-shrink-0 "
          onClick={() => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
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
          <LocateFixed size={24} />
        </Button>
      </nav>
    </header>
  );
};

export default Header;
