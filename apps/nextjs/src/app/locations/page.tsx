"use client";

import { useState } from "react";
import Marker from "@/components/map/marker";
import type { Location } from "@/types";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import type { Fetcher } from "swr";
import useSWR from "swr";

//Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher: Fetcher<Location[], string> = (url) =>
  fetch(url).then((res) => res.json());

const Locations = () => {
  const { data: locations } = useSWR("/api/locations", fetcher);

  const [position, setPosition] = useState({
    // 지도의 초기 위치
    center: { lat: 37.564214, lng: 127.001699 },
    // 지도 위치 변경시 panto를 이용할지에 대해서 정의
    isPanto: true,
  });

  const handlePosition = (lat: number, lng: number) => {
    setPosition((p) => ({ ...p, center: { lat, lng } }));
  };

  return (
    <Map
      center={position.center}
      isPanto={position.isPanto}
      level={7}
      style={{ width: "100%", height: "100vh" }}
    >
      {locations?.map((location) => (
        <Marker
          location={location}
          key={location.name}
          onClick={() =>
            handlePosition(
              Number(location.address.y),
              Number(location.address.x),
            )
          }
        />
      ))}
    </Map>
  );
};

export default Locations;
