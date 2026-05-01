import { keyframes, style } from "@vanilla-extract/css";

import { vars } from "./theme.css";

const messageIn = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(-8px)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0)",
  },
});

export const messageViewport = style({
  position: "fixed",
  top: vars.space.xl,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 20000,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  width: "min(92vw, 420px)",
  pointerEvents: "none",
});

const messageBase = style({
  borderRadius: vars.borderRadius.md,
  padding: `${vars.space.md} ${vars.space.lg}`,
  border: `1px solid ${vars.color.cardBorder}`,
  boxShadow: vars.shadow.md,
  fontSize: "13px",
  fontWeight: 600,
  animation: `${messageIn} 160ms ease-out`,
  pointerEvents: "auto",
});

export const messageSuccess = style([
  messageBase,
  {
    background: "#0b3b31",
    borderColor: "#13b38d",
    color: vars.color.textPrimary,
  },
]);

export const messageError = style([
  messageBase,
  {
    background: "#4b1f24",
    borderColor: "#ff6b78",
    color: vars.color.textPrimary,
  },
]);
