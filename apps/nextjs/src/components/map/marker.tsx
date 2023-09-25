import { cn } from "@/libs/tailwind";
import type { Location } from "@/types";
import { CustomOverlayMap } from "react-kakao-maps-sdk";

import LocationFillIcon from "../../../public/icons/location-fill.svg";
import { Button } from "../ui/button";

const Marker = ({
  location,
  onClick,
  isMarked,
}: {
  location: Location;
  isMarked: boolean;
  onClick: () => void;
}) => {
  const { address } = location;

  return (
    <>
      <CustomOverlayMap
        position={{ lat: Number(address.y), lng: Number(address.x) }}
        zIndex={10}
      >
        <Button
          variant="ghost"
          className="relative rounded-full hover:bg-transparent"
          onClick={onClick}
        >
          <LocationFillIcon
            className={cn(isMarked ? "h-12 w-12 brightness-125" : "h-8 w-8")}
          />
        </Button>
      </CustomOverlayMap>
      )
    </>
  );
};

export default Marker;
