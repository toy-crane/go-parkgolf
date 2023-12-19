"use client";

import { useRef } from "react";
import { useUserStore } from "@/libs/store/user";
import type { UserState } from "@/libs/store/user";

function UserStoreInitializer({ user }: UserState) {
  const initialized = useRef(false);
  if (!initialized.current) {
    if (user) {
      useUserStore.setState({ user });
    }
    initialized.current = true;
  }
  return null;
}

export default UserStoreInitializer;
