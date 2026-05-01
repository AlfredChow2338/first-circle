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

export const moreMenuWrapperStyle = style({
  position: "relative",
  display: "inline-flex",
});

export const moreMenuPanelStyle = style({
  position: "absolute",
  top: "calc(100% + 8px)",
  right: 0,
  minWidth: "220px",
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  padding: vars.space.sm,
  borderRadius: vars.borderRadius.md,
  border: `1px solid ${vars.color.cardBorder}`,
  background: vars.color.cardBg,
  boxShadow: vars.shadow.md,
  zIndex: 10,
});

export const moreMenuItemButtonStyle = style({
  width: "100%",
  justifyContent: "flex-start",
  selectors: {
    "&:hover": {
      transform: "none",
    },
    "&:active": {
      transform: "none",
    },
  },
});
