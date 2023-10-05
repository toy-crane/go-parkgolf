"use client";

import React, { createContext, useCallback, useEffect } from "react";

interface AmplitudeProviderProps {
  apiKey: string;
  children: React.ReactNode;
}

const AmplitudeContext = createContext<
  | {
      track: (
        eventName: string,
        eventProperties?: Record<string, unknown>,
      ) => void;
    }
  | undefined
>(undefined);

let amplitude: any;

const AmplitudeProvider = ({ children, apiKey }: AmplitudeProviderProps) => {
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

  return (
    <AmplitudeContext.Provider value={{ track }}>
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
