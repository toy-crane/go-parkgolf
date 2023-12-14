import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nlclqihmkqqmdmflexer.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sY2xxaWhta3FxbWRtZmxleGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkzMjQwODUsImV4cCI6MjAxNDkwMDA4NX0.2ApqEVKU-wsq1lrKYwlHjkZCW4U0zFPrnCceP_-8ZCQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
