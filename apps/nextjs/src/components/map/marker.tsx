import type { Location } from "@/types";
import { CustomOverlayMap } from "react-kakao-maps-sdk";

import LocationFillIcon from "../../../public/icons/location-fill.svg";
import { Button } from "../ui/button";

const Marker = ({
  location,
  onClick,
}: {
  location: Location;
  onClick: () => void;
}) => {
  const { name, address } = location;

  return (
    <>
      <CustomOverlayMap
        position={{ lat: Number(address.y), lng: Number(address.x) }}
        zIndex={10}
      >
        <Button variant="outline" className="bg-white" onClick={onClick}>
          <LocationFillIcon className="mr-2 h-6 w-6" />
          {name}
        </Button>
      </CustomOverlayMap>
      )
    </>
  );
};

export default Marker;
