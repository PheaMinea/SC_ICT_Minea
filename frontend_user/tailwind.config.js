/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],

  theme: {
    extend: {
      screens: {
        xs: "320px",
        "sm-custom": "360px",

        iphone: { max: "375px" },
        "iphone-max": { max: "414px" },

        tablet: "768px",
        "tablet-lg": "820px",
        ipad: "834px",

        laptop: "1024px",
        "laptop-lg": "1280px",

        desktop: "1440px",
        "desktop-lg": "1600px",

        fhd: "1920px",
        "2k": "2560px",
        "4k": "3840px",
      },

      colors: {
        brand: {
          DEFAULT: "#2563EB",
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },

        canvas: {
          bg: "#F8FAFC",
          surface: "#FFFFFF",
          subtle: "#F1F5F9",
        },

        blue: {
          900: "#0B1849",
          800: "#16265f",
        },

        red: {
          400: "#E8524A",
          500: "#C0392B",
          600: "#A93226",
          700: "#7B241C",
        },

        light: "#F5F5F5",
      },

      fontFamily: {
        sans: [
          "Inter",
          "Kantumruy Pro",
          "sans-serif",
        ],

        english: ["Inter", "sans-serif"],

        khmer: [
          "Kantumruy Pro",
          "sans-serif",
        ],
      },

      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",

        "slide-up":
          "slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",

        "slide-left":
          "slideLeft 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards",

        "slide-right":
          "slideRight 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards",

        "zoom-in":
          "zoomIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",

        "bounce-slow": "bounce 2s infinite",

        "float-slow": "floatSlow 3s ease-in-out infinite",

        "pulse-slow": "pulse 3s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },

        slideUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(16px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        slideLeft: {
          "0%": {
            opacity: "0",
            transform: "translateX(-16px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },

        slideRight: {
          "0%": {
            opacity: "0",
            transform: "translateX(16px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },

        zoomIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.97)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },

        floatSlow: {
          "0%, 100%": {
            transform: "translateY(0)",
          },

          "50%": {
            transform: "translateY(-10px)",
          },
        },
      },
    },
  },

  plugins: [],
};