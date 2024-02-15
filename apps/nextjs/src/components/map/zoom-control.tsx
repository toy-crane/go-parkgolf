"use client";

import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "../ui/button";

interface Props {
  zoomIn: () => void;
  zoomOut: () => void;
}

const ZoomControl = ({ zoomIn, zoomOut }: Props) => {
  return (
    <div className="flex flex-col">
      <Button
        onClick={() => zoomIn()}
        variant={"secondary"}
        size="smIcon"
        className="rounded-b-none border border-b"
      >
        <PlusIcon />
      </Button>
      <Button
        onClick={() => zoomOut()}
        variant={"secondary"}
        size="smIcon"
        className="rounded-t-none border"
      >
        <MinusIcon />
      </Button>
    </div>
  );
};

export default ZoomControl;
