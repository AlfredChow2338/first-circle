import { style } from "@vanilla-extract/css";

import { vars } from "./theme.css";

export const buttonWrapperStyle = style({
  display: "flex",
  gap: vars.space.md,
  justifyContent: "space-between",
});
