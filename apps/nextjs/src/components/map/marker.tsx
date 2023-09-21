import { useState } from "react";
import type { Location } from "@/types";
import { CustomOverlayMap, MapMarker } from "react-kakao-maps-sdk";

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
      <MapMarker
        key={name}
        position={{ lat: Number(address.y), lng: Number(address.x) }}
        onClick={() => {
          onClick();
        }}
      />
      <CustomOverlayMap
        position={{ lat: Number(address.y), lng: Number(address.x) }}
      >
        <div>{name}</div>
      </CustomOverlayMap>
    </>
  );
};

export default Marker;
