import * as buttonStyles from "src/styles/button.css";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "success";
type ButtonSize = "small" | "medium" | "large";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  className,
  ...rest
}: ButtonProps) {
  const variantClass = {
    primary: buttonStyles.buttonPrimary,
    secondary: buttonStyles.buttonSecondary,
    danger: buttonStyles.buttonDanger,
    success: buttonStyles.buttonSuccess,
  }[variant];

  const sizeClass = {
    small: buttonStyles.buttonSmall,
    medium: "",
    large: buttonStyles.buttonLarge,
  }[size];

  const combinedClassName = [variantClass, sizeClass, className].filter(Boolean).join(" ");

  return (
    <button type={type} className={combinedClassName} {...rest}>
      {children}
    </button>
  );
}
