import { globalStyle } from "@vanilla-extract/css";

import { vars } from "./theme.css";

// Mobile Responsive Styles
// globalStyle("@media (max-width: 768px)", {
//   main: {
//     padding: `${vars.space.xl} ${vars.space.lg}`,
//   },
// });

globalStyle("main", {
  "@media": {
    "(max-width: 768px)": {
      padding: `${vars.space.xl} ${vars.space.lg}`,
    },
  },
});

globalStyle("h1", {
  "@media": {
    "(max-width: 768px)": {
      fontSize: "24px",
      marginBottom: vars.space.xxl,
    },
    "(max-width: 480px)": {
      fontSize: "20px",
    },
  },
});

globalStyle("[data-radix-dialog-content]", {
  "@media": {
    "(max-width: 768px)": {
      width: "95vw",
      maxWidth: "95vw",
      padding: `${vars.space.xxl} ${vars.space.lg}`,
      maxHeight: "90vh",
      borderRadius: vars.borderRadius.md,
    },
    "(max-width: 480px)": {
      padding: `${vars.space.xl} ${vars.space.md}`,
    },
  },
});

globalStyle("[data-radix-dialog-title]", {
  "@media": {
    "(max-width: 768px)": {
      fontSize: "20px",
    },
  },
});

globalStyle("input, textarea, select", {
  "@media": {
    "(max-width: 768px)": {
      fontSize: "16px",
    },
  },
});

globalStyle("button", {
  "@media": {
    "(max-width: 768px)": {
      padding: `${vars.space.md} ${vars.space.xl}`,
      fontSize: "14px",
      width: "100%",
      marginBottom: vars.space.sm,
    },
  },
});

globalStyle("section button", {
  "@media": {
    "(max-width: 768px)": {
      marginRight: 0,
      marginTop: vars.space.md,
    },
  },
});

globalStyle("label", {
  "@media": {
    "(max-width: 480px)": {
      fontSize: "12px",
    },
  },
});
