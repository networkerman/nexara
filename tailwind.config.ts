import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        /* shadcn/ui semantic tokens — mapped to Onextel design system */
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        /* Onextel brand palette — direct tokens */
        brand: {
          red: "#FF3535",
          "red-dark": "#D72327",
          "red-email": "#F5002F",
          charcoal: "#2E2E2E",
          navy: "#2B2B2B",
          sky: "#DDE7F1",
          "soft-grey": "#F0F0F0",
          "mid-grey": "#E2E8F0",
          white: "#FFFFFF",
        },
      },

      fontFamily: {
        sans: ["Montserrat", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
        heading: ["Pluto Sans", "Montserrat", "-apple-system", "sans-serif"],
        document: ["Open Sans", "Georgia", "serif"],
      },

      fontSize: {
        /* Onextel typography scale */
        "display-xl": ["64px", { lineHeight: "1.05", letterSpacing: "-1.5px", fontWeight: "900" }],
        "display-lg": ["48px", { lineHeight: "1.1",  letterSpacing: "-1.0px", fontWeight: "700" }],
        "display-md": ["36px", { lineHeight: "1.15", letterSpacing: "-0.5px", fontWeight: "700" }],
        "heading-xl": ["28px", { lineHeight: "1.2",  letterSpacing: "-0.25px", fontWeight: "700" }],
        "heading-lg": ["22px", { lineHeight: "1.3",  letterSpacing: "0px",     fontWeight: "700" }],
        "heading-md": ["18px", { lineHeight: "1.35", letterSpacing: "0px",     fontWeight: "500" }],
        "heading-sm": ["15px", { lineHeight: "1.4",  letterSpacing: "0.1px",   fontWeight: "500" }],
        "body-lg":    ["16px", { lineHeight: "1.6",  letterSpacing: "0px",     fontWeight: "400" }],
        "body-md":    ["14px", { lineHeight: "1.6",  letterSpacing: "0px",     fontWeight: "400" }],
        "body-sm":    ["12px", { lineHeight: "1.5",  letterSpacing: "0.1px",   fontWeight: "400" }],
        "ui-label":   ["13px", { lineHeight: "1.4",  letterSpacing: "0.3px",   fontWeight: "600" }],
        "ui-button":  ["17px", { lineHeight: "1.0",  letterSpacing: "0.2px",   fontWeight: "700" }],
        "ui-btn-sm":  ["14px", { lineHeight: "1.0",  letterSpacing: "0.2px",   fontWeight: "700" }],
        "ui-caption": ["11px", { lineHeight: "1.4",  letterSpacing: "0.2px",   fontWeight: "400" }],
        "ui-data":    ["13px", { lineHeight: "1.4",  letterSpacing: "0px",     fontWeight: "500" }],
      },

      borderRadius: {
        /* shadcn relative tokens */
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        /* Onextel fixed token set */
        "brand-xs":   "2px",
        "brand-sm":   "4px",
        "brand-md":   "6px",
        "brand-lg":   "8px",
        "brand-xl":   "12px",
        "brand-2xl":  "16px",
        "brand-full": "9999px",
      },

      spacing: {
        /* Onextel 8px-base spacing tokens */
        "xxs": "4px",
        "xs":  "8px",
        "sm":  "12px",
        /* md/lg/xl are standard Tailwind (16/24/32) — align with Onextel tokens */
        "2xl-brand": "48px",
        "3xl-brand": "64px",
        "4xl-brand": "96px",
        "5xl-brand": "128px",
      },

      boxShadow: {
        /* Onextel elevation system */
        "el-1": "0 1px 4px rgba(0,0,0,0.08)",
        "el-2": "0 4px 16px rgba(0,0,0,0.12)",
        "el-3": "0 8px 32px rgba(0,0,0,0.16)",
        "el-4": "0 16px 48px rgba(0,0,0,0.24)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
