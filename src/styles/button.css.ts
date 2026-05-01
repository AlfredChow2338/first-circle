import { style } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const buttonBase = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.space.sm,
  padding: `${vars.space.md} ${vars.space.xxl}`,
  borderRadius: vars.borderRadius.md,
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  border: "none",
  outline: "none",
  fontFamily: "inherit",
  whiteSpace: "nowrap",
  selectors: {
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
      pointerEvents: "none",
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primaryBlue}`,
      outlineOffset: "2px",
    },
  },
});

export const buttonPrimary = style([
  buttonBase,
  {
    background: `linear-gradient(135deg, ${vars.color.primaryBlue} 0%, ${vars.color.primaryBlueHover} 100%)`,
    color: vars.color.textPrimary,
    boxShadow: "0 2px 8px rgba(0, 102, 255, 0.24)",
    selectors: {
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 16px rgba(0, 102, 255, 0.32)",
      },
      "&:active": {
        transform: "translateY(0)",
        boxShadow: "0 2px 8px rgba(0, 102, 255, 0.24)",
      },
    },
  },
]);

export const buttonSecondary = style([
  buttonBase,
  {
    background: "rgba(255, 255, 255, 0.08)",
    color: vars.color.textPrimary,
    border: `1px solid ${vars.color.cardBorder}`,
    selectors: {
      "&:hover": {
        background: "rgba(255, 255, 255, 0.12)",
        borderColor: vars.color.textSecondary,
        transform: "translateY(-1px)",
      },
      "&:active": {
        transform: "translateY(0)",
      },
    },
  },
]);

export const buttonDanger = style([
  buttonBase,
  {
    background: `linear-gradient(135deg, ${vars.color.error} 0%, #e63946 100%)`,
    color: vars.color.textPrimary,
    boxShadow: "0 2px 8px rgba(255, 71, 87, 0.24)",
    selectors: {
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 16px rgba(255, 71, 87, 0.32)",
      },
      "&:active": {
        transform: "translateY(0)",
        boxShadow: "0 2px 8px rgba(255, 71, 87, 0.24)",
      },
    },
  },
]);

export const buttonSuccess = style([
  buttonBase,
  {
    background: `linear-gradient(135deg, ${vars.color.success} 0%, #00b894 100%)`,
    color: "#0a0e1a",
    boxShadow: "0 2px 8px rgba(0, 212, 170, 0.24)",
    selectors: {
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 16px rgba(0, 212, 170, 0.32)",
      },
      "&:active": {
        transform: "translateY(0)",
        boxShadow: "0 2px 8px rgba(0, 212, 170, 0.24)",
      },
    },
  },
]);

export const buttonSmall = style({
  padding: `${vars.space.sm} ${vars.space.lg}`,
  fontSize: "13px",
});

export const buttonLarge = style({
  padding: `${vars.space.lg} ${vars.space.xxxl}`,
  fontSize: "16px",
});