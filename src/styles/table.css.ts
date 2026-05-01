import { style } from "@vanilla-extract/css";

import { vars } from "./theme.css";

export const tableContainer = style({
  width: "100%",
  overflowX: "auto",
  marginTop: vars.space.xxl,
  borderRadius: vars.borderRadius.lg,
  WebkitOverflowScrolling: "touch",
});

export const table = style({
  width: "100%",
  minWidth: "600px",
  background: vars.color.cardBg,
  borderRadius: vars.borderRadius.lg,
  border: `1px solid ${vars.color.cardBorder}`,
  boxShadow: vars.shadow.md,
});

export const tableHead = style({
  background: "rgba(0, 102, 255, 0.08)",
  borderBottom: `1px solid ${vars.color.cardBorder}`,
});

export const tableHeader = style({
  padding: `${vars.space.lg} ${vars.space.xl}`,
  textAlign: "left",
  fontSize: "13px",
  fontWeight: 600,
  color: vars.color.textSecondary,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const tableCell = style({
  padding: `${vars.space.lg} ${vars.space.xl}`,
  borderTop: `1px solid ${vars.color.cardBorder}`,
  fontSize: "14px",
  color: vars.color.textPrimary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "200px",
});

export const tableRow = style({
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  ":hover": {
    background: "rgba(255, 255, 255, 0.02)",
  },
});

export const statusInline = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.sm,
});

export const statusTooltipWrapper = style({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  "@media": {
    "screen and (max-width: 768px)": {
      top: "4px",
    },
  },
});

export const failedInfoIconButton = style({
  width: "18px",
  height: "18px",
  borderRadius: "9999px",
  border: `1px solid ${vars.color.cardBorder}`,
  background: "rgba(255, 255, 255, 0.05)",
  color: vars.color.textSecondary,
  padding: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "11px",
  fontWeight: 700,
  lineHeight: 1,
  selectors: {
    "&:hover": {
      background: "rgba(255, 255, 255, 0.12)",
      color: vars.color.textPrimary,
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primaryBlue}`,
      outlineOffset: "2px",
    },
  },
});

export const tooltipContent = style({
  position: "absolute",
  bottom: "calc(100% + 8px)",
  right: 0,
  zIndex: 10,
  background: vars.color.cardBg,
  color: vars.color.textPrimary,
  border: `1px solid ${vars.color.cardBorder}`,
  borderRadius: vars.borderRadius.md,
  boxShadow: vars.shadow.md,
  padding: `${vars.space.sm} ${vars.space.md}`,
  width: "max-content",
  maxWidth: "280px",
  whiteSpace: "normal",
  wordBreak: "break-word",
  fontSize: "12px",
  lineHeight: 1.4,
});

export const statusTableCell = style({
  overflow: "visible",
  textOverflow: "clip",
  maxWidth: "none",
});
