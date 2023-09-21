"use client";

import { useState } from "react";
import type { Location } from "@/types";
import {
  Container as MapDiv,
  Marker,
  NaverMap,
  useNavermaps,
} from "react-naver-maps";
import type { Fetcher } from "swr";
import useSWR from "swr";

const INITIAL_ZOOM = 10;

//Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher: Fetcher<Location[], string> = (url) =>
  fetch(url).then((res) => res.json());

export const Map = () => {
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const navermaps = useNavermaps();
  const { data } = useSWR("/api/locations", fetcher);

  return (
    <MapDiv
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <NaverMap defaultZoom={INITIAL_ZOOM} ref={setMap}>
        {data?.map(({ name, address }) => (
          <Marker
            key={name}
            defaultPosition={
              new navermaps.LatLng(Number(address.y), Number(address.x))
            }
            onClick={() => {
              map?.setZoom(13);
              map?.panTo(
                {
                  lat: Number(address.y),
                  lng: Number(address.x),
                },
                { duration: 200 },
              );
            }}
          />
        ))}
      </NaverMap>
    </MapDiv>
  );
};
