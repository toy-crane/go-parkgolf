import { create } from "zustand";

export interface UserAgentState {
  isMobileApp?: boolean;
}

export const useUserAgentStore = create<UserAgentState>()(() => ({
  isMobileApp: undefined,
}));
