import { style } from "@vanilla-extract/css";

import { vars } from "./theme.css";

export const buttonWrapperStyle = style({
  display: "flex",
  gap: vars.space.md,
  justifyContent: "space-between",
});

export const offlineStatusStyle = style({
  marginTop: vars.space.md,
  marginBottom: vars.space.lg,
  color: vars.color.textSecondary,
  fontSize: "13px",
});
