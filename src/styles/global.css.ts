import { globalStyle } from "@vanilla-extract/css";

import { vars } from "./theme.css";

globalStyle("*", {
  margin: 0,
  padding: 0,
  boxSizing: "border-box",
});

globalStyle("body", {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Roboto", sans-serif',
  background: `linear-gradient(135deg, ${vars.color.darkBg} 0%, #0f1420 100%)`,
  color: vars.color.textPrimary,
  lineHeight: 1.6,
  minHeight: "100vh",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
});

globalStyle("html, body", {
  overflowX: "hidden",
});

globalStyle("main", {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: `${vars.space.xxxl} ${vars.space.xxl}`,
});

globalStyle("h1", {
  fontSize: "32px",
  fontWeight: 700,
  marginBottom: vars.space.xxxl,
  background: `linear-gradient(135deg, ${vars.color.textPrimary} 0%, ${vars.color.primaryBlue} 100%)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
});

globalStyle("button:not([class])", {
  background: vars.color.primaryBlue,
  color: vars.color.textPrimary,
  border: "none",
  padding: `${vars.space.md} ${vars.space.xxl}`,
  borderRadius: vars.borderRadius.md,
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 2px 8px rgba(0, 102, 255, 0.24)",
});

globalStyle("button:not([class]):active", {
  transform: "translateY(0)",
});

// Remove default button styles - using Button component instead
globalStyle("button:not([class])", {
  background: vars.color.primaryBlue,
  color: vars.color.textPrimary,
  border: "none",
  padding: `${vars.space.md} ${vars.space.xxl}`,
  borderRadius: vars.borderRadius.md,
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 2px 8px rgba(0, 102, 255, 0.24)",
});

globalStyle("button:not([class]):active", {
  transform: "translateY(0)",
});

globalStyle("label", {
  display: "block",
  marginBottom: vars.space.xxl,
  fontSize: "13px",
  fontWeight: 600,
  color: vars.color.textSecondary,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

globalStyle("input, textarea, select", {
  width: "100%",
  background: "rgba(255, 255, 255, 0.04)",
  border: `1px solid ${vars.color.cardBorder}`,
  borderRadius: vars.borderRadius.md,
  padding: `${vars.space.md} ${vars.space.lg}`,
  marginTop: vars.space.sm,
  color: vars.color.textPrimary,
  fontSize: "14px",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  fontFamily: "inherit",
});

globalStyle("input:focus, textarea:focus, select:focus", {
  outline: "none",
  borderColor: vars.color.primaryBlue,
  background: "rgba(255, 255, 255, 0.06)",
  boxShadow: "0 0 0 3px rgba(0, 102, 255, 0.1)",
});

globalStyle("textarea", {
  minHeight: "120px",
  resize: "vertical",
  fontFamily: '"Monaco", "Courier New", monospace',
});

globalStyle("section", {
  marginTop: vars.space.xxl,
});

globalStyle("section h3", {
  fontSize: "18px",
  fontWeight: 600,
  marginBottom: vars.space.xl,
  color: vars.color.textPrimary,
});

globalStyle("section p", {
  marginBottom: vars.space.md,
  color: vars.color.textSecondary,
  fontSize: "14px",
});

globalStyle("section button", {
  marginRight: vars.space.md,
  marginTop: vars.space.xxl,
});

globalStyle("section button:last-child", {
  marginRight: 0,
});

globalStyle("[data-radix-dialog-title]", {
  fontSize: "24px",
  fontWeight: 700,
  marginBottom: vars.space.sm,
  color: vars.color.textPrimary,
});

globalStyle("[data-radix-dialog-description]", {
  fontSize: "14px",
  color: vars.color.textSecondary,
  marginBottom: vars.space.xxl,
});

globalStyle("[data-radix-tooltip-content]", {
  background: vars.color.cardBg,
  color: vars.color.textPrimary,
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.borderRadius.sm,
  fontSize: "12px",
  border: `1px solid ${vars.color.cardBorder}`,
  boxShadow: vars.shadow.md,
  zIndex: 100,
});

globalStyle("::-webkit-scrollbar", {
  width: "8px",
  height: "8px",
});

globalStyle("::-webkit-scrollbar-track", {
  background: "rgba(255, 255, 255, 0.02)",
});

globalStyle("::-webkit-scrollbar-thumb", {
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "4px",
});

globalStyle("::-webkit-scrollbar-thumb:hover", {
  background: "rgba(255, 255, 255, 0.15)",
});
