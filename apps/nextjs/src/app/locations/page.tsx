"use client";

import { useState } from "react";
import {
  Container as MapDiv,
  NaverMap,
  NavermapsProvider,
} from "react-naver-maps";

const INITIAL_CENTER: [number, number] = [37.5262411, 126.99289439];
const INITIAL_ZOOM = 10;

const Map = () => {
  // useRef 대신 useState를 통해 ref를 가져옵니다.
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  return (
    <MapDiv
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <NaverMap
        defaultZoom={INITIAL_ZOOM}
        ref={setMap}
        defaultCenter={INITIAL_CENTER}
      ></NaverMap>
    </MapDiv>
  );
};

const Locations = () => {
  return (
    <NavermapsProvider ncpClientId={process.env.NEXT_PUBLIC_NCP_CLIENT_ID!}>
      <Map />
    </NavermapsProvider>
  );
};

export default Locations;
