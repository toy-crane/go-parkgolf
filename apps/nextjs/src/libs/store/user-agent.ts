import { create } from "zustand";

export interface UserAgentState {
  isMobileApp?: boolean;
  isWebview?: boolean;
}

export const useUserAgentStore = create<UserAgentState>()(() => ({
  isMobileApp: undefined,
  isWebview: undefined,
}));
