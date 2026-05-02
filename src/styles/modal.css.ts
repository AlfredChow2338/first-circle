import { style, keyframes } from "@vanilla-extract/css";

import { vars } from "./theme.css";

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const slideIn = keyframes({
  from: {
    opacity: 0,
    transform: "translate(-50%, -48%)",
  },
  to: {
    opacity: 1,
    transform: "translate(-50%, -50%)",
  },
});

export const modalOverlay = style({
  background: "rgba(0, 0, 0, 0.8)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  position: "fixed",
  inset: 0,
  zIndex: 9998,
  animation: `${fadeIn} 0.2s ease-out`,
});

export const modalContent = style({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 9999,
  background: vars.color.cardBg,
  border: `1px solid ${vars.color.cardBorder}`,
  borderRadius: vars.borderRadius.lg,
  boxShadow: vars.shadow.lg,
  padding: vars.space.lg,
  maxWidth: "800px",
  maxHeight: "85vh",
  width: "90vw",
  overflowY: "auto",
  animation: `${slideIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
  "@media": {
    "(max-width: 767px)": {
      top: 0,
      left: 0,
      transform: "none",
      width: "100%",
      maxWidth: "100%",
      /* `100vh` runs under Chrome’s bottom toolbar; `100dvh` tracks the visible viewport. */
      height: "100dvh",
      maxHeight: "100dvh",
      minHeight: "100dvh",
      borderRadius: 0,
      boxSizing: "border-box",
      /* Toolbar + home indicator: `100vh` safe-area is often 0 on Android; keep generous bottom inset. */
      paddingBottom: "max(5rem, calc(2.5rem + env(safe-area-inset-bottom, 0px)))",
      /* `slideIn` animates `transform` and overrides `transform: none`, breaking fullscreen layout. */
      animation: `${fadeIn} 0.2s ease-out`,
    },
  },
});

export const modalContentStepTwo = style({
  width: "90vw",
  maxWidth: "90vw",
  borderRadius: vars.borderRadius.lg,
});

export const closeButton = style({
  position: "absolute",
  top: vars.space.md,
  right: vars.space.md,
  border: "none",
  borderRadius: vars.borderRadius.md,
  background: "rgba(255, 255, 255, 0.08)",
  color: vars.color.textPrimary,
  height: "32px",
  lineHeight: "12px",
  textAlign: "center",
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: 700,
  padding: vars.space.md,
  "@media": {
    "(max-width: 768px)": {
      width: "36px",
    },
  },
});

export const summaryItem = style({
  background: "rgba(255, 255, 255, 0.03)",
  padding: vars.space.lg,
  borderRadius: vars.borderRadius.md,
  marginBottom: vars.space.md,
  borderLeft: `3px solid ${vars.color.primaryBlue}`,
});

export const uploadMeta = style({
  marginTop: vars.space.sm,
  marginBottom: vars.space.md,
  fontSize: "13px",
  color: vars.color.textSecondary,
});

export const uploadError = style({
  marginTop: vars.space.sm,
  marginBottom: vars.space.md,
  color: "#ff6b6b",
  fontSize: "13px",
  fontWeight: 500,
});

export const reviewValidationError = style({
  marginTop: vars.space.sm,
  marginBottom: vars.space.md,
  color: "#ff6b6b",
  fontSize: "13px",
  fontWeight: 600,
});

export const fileUploadWrapper = style({
  position: "relative",
  display: "inline-block",
  width: "100%",
});

export const fileUploadInput = style({
  position: "absolute",
  width: "0.1px",
  height: "0.1px",
  opacity: 0,
  overflow: "hidden",
  zIndex: -1,
});

export const fileUploadLabel = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.space.md,
  width: "100%",
  padding: `${vars.space.lg} ${vars.space.xxl}`,
  marginTop: vars.space.sm,
  background: "rgba(0, 102, 255, 0.08)",
  border: `2px dashed ${vars.color.primaryBlue}`,
  borderRadius: vars.borderRadius.md,
  color: vars.color.primaryBlue,
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  selectors: {
    "&:hover": {
      background: "rgba(0, 102, 255, 0.12)",
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  },
});

export const fileUploadIcon = style({
  fontSize: "20px",
  lineHeight: 1,
});
