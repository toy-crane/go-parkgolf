import type { Location } from "@/types";
import { CustomOverlayMap, MapMarker } from "react-kakao-maps-sdk";

const Marker = ({
  location,
  onClick,
  showLabel,
}: {
  location: Location;
  showLabel: boolean;
  onClick: () => void;
}) => {
  const { name, address } = location;

  return (
    <>
      <MapMarker
        key={name}
        position={{ lat: Number(address.y), lng: Number(address.x) }}
        onClick={() => {
          onClick();
        }}
      />
      {showLabel && (
        <CustomOverlayMap
          position={{ lat: Number(address.y), lng: Number(address.x) }}
        >
          <div>{name}</div>
        </CustomOverlayMap>
      )}
    </>
  );
};

export default Marker;
