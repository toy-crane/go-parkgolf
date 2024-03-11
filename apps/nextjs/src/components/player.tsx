"use client";

import dynamic from "next/dynamic";
import type { ReactPlayerProps } from "react-player";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

export const Player = ({
  url,
  className,
  ...props
}: {
  url: string;
  className?: string;
} & ReactPlayerProps) => {
  return <ReactPlayer url={url} className={className} {...props} />;
};
