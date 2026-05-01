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