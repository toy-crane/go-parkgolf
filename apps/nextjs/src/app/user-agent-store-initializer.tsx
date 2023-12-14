"use client";

import { useRef } from "react";
import type { UserAgentState } from "@/libs/store/user-agent";
import { useUserAgentStore } from "@/libs/store/user-agent";

function UserAgentStoreInitializer({ isMobileApp }: UserAgentState) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useUserAgentStore.setState({ isMobileApp });
    initialized.current = true;
  }
  return null;
}

export default UserAgentStoreInitializer;
