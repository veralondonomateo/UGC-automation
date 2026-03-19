import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: '#0A0A0A',
          secondary: '#111111',
          tertiary: '#1A1A1A',
        },
        accent: '#00D4FF',
        border: 'rgba(255,255,255,0.08)',
        success: '#00FF88',
        warning: '#FFD700',
        danger: '#FF4444',
      },
    },
  },
  plugins: [],
};

export default config;
