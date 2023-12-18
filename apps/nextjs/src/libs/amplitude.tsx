"use client";

import React, { createContext, useCallback, useEffect } from "react";
import type { User } from "@supabase/supabase-js";

interface AmplitudeProviderProps {
  apiKey: string;
  children: React.ReactNode;
  user?: User;
}

const AmplitudeContext = createContext<
  | {
      track: (
        eventName: string,
        eventProperties?: Record<string, unknown>,
      ) => void;
      login: (userId: string) => void;
      logout: () => void;
    }
  | undefined
>(undefined);

let amplitude: any;

const AmplitudeProvider = ({
  children,
  apiKey,
  user,
}: AmplitudeProviderProps) => {
  useEffect(() => {
    if (user?.id) {
      amplitude?.setUserId(user?.id);
    } else {
      amplitude?.reset();
    }
  }, [user]);

  useEffect(() => {
    const initAmplitude = async () => {
      amplitude = await import("@amplitude/analytics-browser");
      amplitude.init(apiKey, undefined, {
        logLevel: amplitude.Types.LogLevel.Warn,
        defaultTracking: {
          sessions: true,
          formInteractions: true,
        },
      });
    };
    initAmplitude();
  }, [apiKey]);

  const track = useCallback(
    (eventName: string, eventProperties?: Record<string, unknown>) => {
      if (amplitude) {
        amplitude.track(eventName, eventProperties);
      }
    },
    [],
  );

  const login = useCallback((userId: string) => {
    if (amplitude) {
      amplitude.setUserId(userId);
    }
  }, []);

  const logout = useCallback(() => {
    if (amplitude) {
      amplitude.reset();
    }
  }, []);

  return (
    <AmplitudeContext.Provider value={{ track, login, logout }}>
      {children}
    </AmplitudeContext.Provider>
  );
};

function useAmplitude() {
  const context = React.useContext(AmplitudeContext);
  if (context === undefined) {
    throw new Error("useAmplitude must be used within a AmplitudeProvider");
  }
  return context;
}

export { AmplitudeProvider, useAmplitude };
