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
  padding: vars.space.xxxl,
  maxWidth: "800px",
  maxHeight: "85vh",
  width: "90vw",
  overflowY: "auto",
  animation: `${slideIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
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
  selectors: {
    "&:hover": {
      background: "rgba(255, 255, 255, 0.16)",
    },
  },
  padding: vars.space.md,
});

export const stepIndicator = style({
  display: "inline-block",
  background: "rgba(0, 102, 255, 0.1)",
  color: vars.color.primaryBlue,
  padding: `6px ${vars.space.lg}`,
  borderRadius: vars.borderRadius.xl,
  fontSize: "12px",
  fontWeight: 600,
  marginBottom: vars.space.xxl,
  border: "1px solid rgba(0, 102, 255, 0.2)",
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
