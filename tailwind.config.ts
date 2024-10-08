/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["class"],
  theme: {
    borderRadius: {
      sm: "0.25rem",
      base: "0.375rem",
      DEFAULT: "0.375rem",
      full: "9999px",
    },
    boxShadow: {
      DEFAULT: "0px 1px 3px 0px rgba(0, 0, 0, 0.04)",
      "sm+inner":
        "0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1px 0px 0px rgba(255, 255, 255, 0.08) inset",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
      },
    },
    fontFamily: {
      body: ["Suisse Intl"],
      display: ["Suisse Intl"],
    },
    fontSize: {
      sm: "0.875rem",
      base: "1rem",
      md: "1.0625rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.75rem",
      "4xl": "2rem",
      "5xl": "2.25rem",
      "6xl": "2.5rem",
      "7xl": "2.75rem",
      "8xl": "3rem",
      "9xl": "3.25rem",
      "10xl": "3.5rem",
      "11xl": "3.75rem",
      "12xl": "4rem",
      "13xl": "4.25rem",
      "14xl": "4.5rem",
    },
    fontWeight: {
      "400": "400",
      "450": "450",
      "500": "500",
      "550": "550",
      "600": "600",
      "700": "700",
    },
    extend: {
      colors: {
        gray: {
          "1": "var(--color-gray-1)",
          "2": "var(--color-gray-2)",
          "3": "var(--color-gray-3)",
          "4": "var(--color-gray-4)",
          "5": "var(--color-gray-5)",
          "6": "var(--color-gray-6)",
          "7": "var(--color-gray-7)",
          "8": "var(--color-gray-8)",
          "9": "var(--color-gray-9)",
          "10": "var(--color-gray-10)",
          "11": "var(--color-gray-11)",
          "12": "var(--color-gray-12)",
        },
        amber: {
          "1": "#fefdfb",
          "2": "#fff9ed",
          "3": "#fff4d5",
          "4": "#ffecbc",
          "5": "#ffe3a2",
          "6": "#ffd386",
          "7": "#f3ba63",
          "8": "#ee9d2b",
          "9": "#ffb224",
          "10": "#ffa01c",
          "11": "#ad5700",
          "12": "#4e2009",
        },
        green: {
          "1": "#FBFEFC",
          "2": "#F2FCF5",
          "3": "#E9F9EE",
          "4": "#DDF3E4",
          "5": "#CCEBD7",
          "6": "#B4DFC4",
          "7": "#92CEAC",
          "8": "#5BB98C",
          "9": "#30A46C",
          "10": "#299764",
          "11": "#18794E",
          "12": "#153226",
        },
        red: {
          "1": "#fffcfc",
          "2": "#fff8f8",
          "3": "#ffefef",
          "4": "#ffe5e5",
          "5": "#fdd8d8",
          "6": "#f9c6c6",
          "7": "#f3aeaf",
          "8": "#eb9091",
          "9": "#e5484d",
          "10": "#dc3d43",
          "11": "#cd2b31",
          "12": "#381316",
        },
        purple: {
          "1": "var(--color-purple-1)",
          "2": "var(--color-purple-2)",
          "3": "var(--color-purple-3)",
          "4": "var(--color-purple-4)",
          "5": "var(--color-purple-5)",
          "6": "var(--color-purple-6)",
          "7": "var(--color-purple-7)",
          "8": "var(--color-purple-8)",
          "9": "var(--color-purple-9)",
          "10": "var(--color-purple-10)",
          "11": "var(--color-purple-11)",
          "12": "var(--color-purple-12)",
        },
        yellow: {
          "9": "var(--color-yellow-9)",
          "10": "var(--color-yellow-10)",
          "11": "var(--color-yellow-11)",
        },
      },
      textColor: {
        neutral: "var(--text-neutral)",
        "neutral-faded": "var(--text-neutral-faded)",
        primary: "var(--text-primary)",
        "on-neutral": "var(--text-on-neutral)",
        "on-primary": "var(--text-on-primary)",
      },
      backgroundColor: {
        page: "var(--bg-page)",
        "page-faded": "var(--bg-page-faded)",
        neutral: "var(--bg-neutral)",
        "neutral-hover": "var(--bg-neutral-hover)",
        "neutral-active": "var(--bg-neutral-active)",
        "neutral-solid": "var(--bg-neutral-solid)",
        "neutral-solid-hover": "var(--bg-neutral-solid-hover)",
        "neutral-solid-active": "var(--bg-neutral-solid-active)",

        primary: "var(--bg-primary)",
        "primary-hover": "var(--bg-primary-hover)",
        "primary-active": "var(--bg-primary-active)",
        "primary-solid": "var(--bg-primary-solid)",
        "primary-solid-hover": "var(--bg-primary-solid-hover)",
        "primary-solid-active": "var(--bg-primary-solid-active)",
      },
      borderColor: {
        "neutral-subtle": "var(--border-neutral-subtle)",
        neutral: "var(--border-neutral)",
        "neutral-hover": "var(--border-neutral-hover)",
        "neutral-solid": "var(--border-neutral-solid)",
        "neutral-solid-hover": "var(--border-neutral-solid-hover)",

        "primary-subtle": "var(--border-primary-subtle)",
        primary: "var(--border-primary)",
        "primary-hover": "var(--border-primary-hover)",
        "primary-solid": "var(--border-primary-solid)",
        "primary-solid-hover": "var(--border-primary-solid-hover)",
      },
      ringColor: {
        primary: "var(--ring-primary)",
      },
      ringWidth: {
        "3": "3px",
      },
      screens: {
        lg: "912px",
        print: { raw: "print" },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
