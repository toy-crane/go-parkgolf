"use client";

import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/libs/tailwind";
import { Map, MarkerClusterer } from "react-kakao-maps-sdk";

import CurrentPositionButton from "./current-position";
import Marker from "./marker";
import ZoomControl from "./zoom-control";

interface Props {
  markers: {
    position: { lat: number; lng: number };
    text: string;
    to: string;
    selected?: boolean;
  }[];
  center: { lat: number; lng: number };
  level?: number;
  className?: string;
  size?: {
    width: string;
    height: string;
  };
  showCurrentPosition?: boolean;
}

const KakaoMap = ({
  markers,
  center,
  level,
  className,
  size,
  showCurrentPosition,
}: Props) => {
  const router = useRouter();
  const mapRef = useRef<kakao.maps.Map>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleMove = (map: kakao.maps.Map) => {
    const bound = map.getBounds();
    const level = map.getLevel();
    const params = new URLSearchParams(searchParams);
    params.set("lng", String(map.getCenter().getLng()));
    params.set("lat", String(map.getCenter().getLat()));
    params.set("minLng", String(bound.getSouthWest().getLng()));
    params.set("minLat", String(bound.getSouthWest().getLat()));
    params.set("maxLng", String(bound.getNorthEast().getLng()));
    params.set("maxLat", String(bound.getNorthEast().getLat()));
    params.set("level", String(level));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const zoomIn = () => {
    const map = mapRef.current;
    if (!map) return;
    map.setLevel(map.getLevel() - 1);
  };

  const zoomOut = () => {
    const map = mapRef.current;
    if (!map) return;
    map.setLevel(map.getLevel() + 1);
  };

  return (
    <div>
      <div className="content-grid relative">
        <div className="z-map absolute right-0 top-4">
          <div className="flex flex-col gap-4">
            {showCurrentPosition && <CurrentPositionButton />}
            <ZoomControl zoomIn={zoomIn} zoomOut={zoomOut} />
          </div>
        </div>
      </div>
      <Map
        className={cn("round-md mb-2", className)}
        onDragEnd={handleMove}
        onZoomChanged={handleMove}
        center={center}
        ref={mapRef}
        style={{
          // 지도의 크기
          width: size?.width ?? "100%",
          height: size?.height ?? "400px",
        }}
        level={level ?? 5} // 지도의 확대 레벨
      >
        <MarkerClusterer
          averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
          minLevel={10} // 클러스터 할 최소 지도 레벨
          calculator={[10, 30]} // 클러스터의 크기 구분 값, 각 사이값마다 설정된 text나 style이 적용된다
          styles={[
            {
              // calculator 각 사이 값 마다 적용될 스타일을 지정한다
              width: "40px",
              height: "40px",
              background: "#1bc8df",
              borderRadius: "20px",
              color: "#000",
              textAlign: "center",
              fontWeight: "bold",
              lineHeight: "41px",
            },
            {
              width: "50px",
              height: "50px",
              background: "#e6789c",
              borderRadius: "25px",
              color: "#000",
              textAlign: "center",
              fontWeight: "bold",
              lineHeight: "51px",
            },
          ]}
        >
          {markers.map((marker) => (
            <Marker
              onClick={() => router.push(marker.to)}
              {...marker}
              key={marker.to}
            />
          ))}
        </MarkerClusterer>
      </Map>
    </div>
  );
};

export default KakaoMap;
