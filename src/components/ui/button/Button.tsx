import React, { forwardRef } from "react";
import { tv } from "tailwind-variants";

const button = tv({
  base: "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[3px] border border-ctrl-border bg-ctrl whitespace-nowrap text-fg disabled:opacity-50",
  variants: {
    size: {
      sm: "h-7 px-2.5 text-xs",
      xs: "h-6.5 px-2 text-[11.5px]",
    },
    mono: {
      true: "font-mono text-[11px]",
      false: "",
    },
  },
  defaultVariants: {
    size: "sm",
    mono: false,
  },
});

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: keyof typeof button.variants.size;
  mono?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size, mono, className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={button({ size, mono, className })}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export default Button;
