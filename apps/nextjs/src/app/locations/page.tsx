"use client";

import type { Location } from "@/types";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import type { Fetcher } from "swr";
import useSWR from "swr";

//Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher: Fetcher<Location[], string> = (url) =>
  fetch(url).then((res) => res.json());

const Locations = () => {
  const { data: locations } = useSWR("/api/locations", fetcher);
  return (
    <Map
      center={{ lat: 37.564214, lng: 127.001699 }}
      level={7}
      style={{ width: "100%", height: "100vh" }}
    >
      {locations?.map(({ name, address }) => (
        <MapMarker
          key={name}
          position={{ lat: Number(address.y), lng: Number(address.x) }}
        />
      ))}
    </Map>
  );
};

export default Locations;
