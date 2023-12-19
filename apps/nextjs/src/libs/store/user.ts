import type { User } from "@supabase/supabase-js";
import { create } from "zustand";

export interface UserState {
  user?: User | null;
}

export const useUserStore = create<UserState>()(() => ({
  user: null,
}));
