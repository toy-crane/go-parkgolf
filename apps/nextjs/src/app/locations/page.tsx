"use client";

import { useState } from "react";
import type { Location } from "@/types";
import { Map, MapMarker } from "react-kakao-maps-sdk";
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
    isPanto: false,
  });

  return (
    <Map
      center={position.center}
      level={7}
      style={{ width: "100%", height: "100vh" }}
    >
      {locations?.map(({ name, address }) => (
        <MapMarker
          key={name}
          position={{ lat: Number(address.y), lng: Number(address.x) }}
          onClick={() => {
            setPosition({
              center: { lat: Number(address.y), lng: Number(address.x) },
              isPanto: true,
            });
          }}
        />
      ))}
    </Map>
  );
};

export default Locations;
