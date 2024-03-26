import type { Config } from "tailwindcss";

import baseConfig from "@acme/tailwind-config";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1028px",
      },
    },
    extend: {
      gridTemplateRows: {
        "score-board": "auto auto 1fr auto",
      },
      gridTemplateColumns: {
        "16": "repeat(16, minmax(0, 1fr))",
        "score-card-1": "50px 50px repeat(1,minmax(0,1fr))",
        "score-card-2": "50px 50px repeat(2,minmax(0,1fr))",
        "score-card-3": "50px 50px repeat(3,minmax(0,1fr))",
        "score-card-4": "50px 50px repeat(4,minmax(0,1fr))",
        "score-result-1": "48px repeat(1,minmax(0,1fr))",
        "score-result-2": "48px repeat(2,minmax(0,1fr))",
        "score-result-3": "48px repeat(3,minmax(0,1fr))",
        "score-result-4": "48px repeat(4,minmax(0,1fr))",
        "course-detail": "100px repeat(2,minmax(0,1fr))",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        blink: "blink 1.5s linear infinite",
      },
      zIndex: {
        header: "var(--header-z-index)",
        map: "var(--map-z-index)",
        "bottom-nav": "var(--bottom-nav-z-index)",
        sheet: "var(--sheet-z-index)",
      },
      height: {
        header: "var(--header-height)",
        "bottom-nav": "var(--bottom-nav-height)",
        "dynamic-screen": "100dvh",
        "short-screen": "98svh",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-safe-area")],
  presets: [baseConfig],
} satisfies Config;
