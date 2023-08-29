"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

const INITIAL_CENTER: [number, number] = [37.5262411, 126.99289439];
const INITIAL_ZOOM = 10;
const MAP_ID = "map";

const Map = () => {
  const mapRef = useRef<naver.maps.Map | null>(null);

  const initializeMap = () => {
    const mapOptions = {
      center: new window.naver.maps.LatLng(...INITIAL_CENTER),
      zoom: INITIAL_ZOOM,
      minZoom: 9,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: {
        position: naver.maps.Position.BOTTOM_LEFT,
      },
    };
    /** https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html */
    const map = new window.naver.maps.Map(MAP_ID, mapOptions);
    mapRef.current = map;
  };

  useEffect(() => {
    return () => {
      mapRef.current?.destroy();
    };
  }, []);

  return (
    <>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NCP_CLIENT_ID}`}
        onReady={initializeMap}
      />
      <div id="map" className="h-full w-full" />
    </>
  );
};

export default Map;
