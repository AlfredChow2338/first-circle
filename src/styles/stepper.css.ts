import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "./theme.css";

export const stepper = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: vars.space.xl,
  marginTop: vars.space.xl,
  marginBottom: vars.space.xl,
  listStyleType: "none",
  "@media": {
    "(max-width: 767px)": {
      gridTemplateColumns: "1fr",
      gap: 0,
    },
  },
});

export const stepItem = style({
  minWidth: 0,
});

export const stepHeader = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  width: "100%",
  minWidth: 0,
  marginBottom: vars.space.sm,
});

export const marker = style({
  width: "22px",
  height: "22px",
  borderRadius: "9999px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: 700,
  border: `1px solid ${vars.color.cardBorder}`,
});

export const markerState = styleVariants({
  completed: {
    background: vars.color.primaryBlue,
    color: vars.color.textPrimary,
    borderColor: vars.color.primaryBlue,
  },
  active: {
    background: vars.color.primaryBlue,
    color: vars.color.textPrimary,
    borderColor: vars.color.primaryBlue,
    boxShadow: `0 0 0 2px rgba(0, 102, 255, 0.25)`,
  },
  waiting: {
    background: "transparent",
    color: vars.color.textSecondary,
    borderColor: vars.color.cardBorder,
  },
});

export const title = style({
  flexShrink: 0,
  fontSize: "15px",
  fontWeight: 600,
  color: vars.color.textPrimary,
});

export const description = style({
  fontSize: "12px",
  color: vars.color.textSecondary,
  lineHeight: 1.4,
});

/** Horizontal segment after the title (desktop / tablet); hidden on mobile in favor of `stepTailConnector` */
export const headerConnector = style({
  flex: "1 1 auto",
  alignSelf: "center",
  minWidth: vars.space.md,
  height: "2px",
  borderRadius: "1px",
  background: "rgba(255, 255, 255, 0.1)",
  "@media": {
    "(max-width: 767px)": {
      display: "none",
    },
  },
});

export const headerConnectorState = styleVariants({
  completed: {
    background: vars.color.primaryBlue,
  },
  active: {
    background: "linear-gradient(90deg, rgba(0, 102, 255, 1) 0%, rgba(0, 102, 255, 0.25) 100%)",
  },
  waiting: {},
});

/** Vertical segment between steps on mobile, aligned with marker center (22px wide → line at 10px) */
export const stepTailConnector = style({
  display: "none",
  "@media": {
    "(max-width: 767px)": {
      display: "block",
      width: "2px",
      height: "28px",
      marginLeft: "10px",
      marginTop: vars.space.sm,
      marginBottom: vars.space.md,
      borderRadius: "1px",
      flexShrink: 0,
      background: "rgba(255, 255, 255, 0.1)",
    },
  },
});

export const stepTailConnectorState = styleVariants({
  completed: {
    "@media": {
      "(max-width: 767px)": {
        background: vars.color.primaryBlue,
      },
    },
  },
  active: {
    "@media": {
      "(max-width: 767px)": {
        background:
          "linear-gradient(180deg, rgba(0, 102, 255, 1) 0%, rgba(0, 102, 255, 0.25) 100%)",
      },
    },
  },
  waiting: {},
});
