import { createGlobalTheme } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
  color: {
    primaryBlue: "#0066ff",
    primaryBlueHover: "#0052cc",
    primaryBlueLight: "#e6f0ff",
    darkBg: "#0a0e1a",
    cardBg: "#141824",
    cardBorder: "#1e2433",
    textPrimary: "#ffffff",
    textSecondary: "#8b92a7",
    textMuted: "#5a6175",
    success: "#00d4aa",
    pending: "#DAA520",
    warning: "#ffb020",
    danger: "#dc143c",
    error: "#ff4757",
  },
  space: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    xxl: "24px",
    xxxl: "32px",
  },
  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },
  shadow: {
    sm: "0 2px 8px rgba(0, 0, 0, 0.12)",
    md: "0 4px 16px rgba(0, 0, 0, 0.16)",
    lg: "0 8px 32px rgba(0, 0, 0, 0.24)",
  },
});
