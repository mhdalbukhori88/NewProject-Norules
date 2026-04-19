import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: "#FFD700",
          400: "#E8B84B",
          500: "#C9952A"
        },
        ink: {
          950: "#0A0A0A",
          900: "#111111",
          800: "#1A1A1A"
        }
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)"],
        body: ["var(--font-inter)"]
      },
      boxShadow: {
        gold: "0 0 12px rgba(232, 184, 75, 0.4)",
        panel: "0 18px 40px rgba(0, 0, 0, 0.35)"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        marquee: "marquee 22s linear infinite",
        shimmer: "shimmer 2.2s linear infinite"
      },
      backgroundImage: {
        "gold-grid":
          "radial-gradient(circle at top, rgba(232,184,75,0.12), transparent 40%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
