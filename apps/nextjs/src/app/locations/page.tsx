"use client";

import { Map } from "@/components/maps/map";
import { NavermapsProvider } from "react-naver-maps";

const Locations = () => {
  return (
    <NavermapsProvider ncpClientId={process.env.NEXT_PUBLIC_NCP_CLIENT_ID!}>
      <Map />
    </NavermapsProvider>
  );
};

export default Locations;
