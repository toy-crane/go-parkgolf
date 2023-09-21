"use client";

import { useState } from "react";
import Marker from "@/components/map/marker";
import type { Location } from "@/types";
import { Map } from "react-kakao-maps-sdk";
import type { Fetcher } from "swr";
import useSWR from "swr";

//Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher: Fetcher<Location[], string> = (url) =>
  fetch(url).then((res) => res.json());

const DEFAULT_POSITION = { lat: 37.564214, lng: 127.001699 };

const Locations = () => {
  const { data: locations } = useSWR("/api/locations", fetcher);

  const [selectedLocation, setSelectedLocation] = useState<
    Location | undefined
  >();

  const address = selectedLocation?.address;

  return (
    <Map
      center={
        address
          ? { lat: Number(address.y), lng: Number(address.x) }
          : DEFAULT_POSITION
      }
      isPanto={true}
      level={7}
      style={{ width: "100%", height: "100vh" }}
    >
      {locations?.map((location) => (
        <Marker
          location={location}
          key={location.name}
          onClick={() => setSelectedLocation(location)}
          showLabel={location === selectedLocation}
        />
      ))}
    </Map>
  );
};

export default Locations;
