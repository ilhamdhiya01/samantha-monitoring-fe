import classNames from "classnames";
import React, { forwardRef } from "react";

export interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedControlProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

// Pilihan tunggal berbentuk tombol bersambung (mis. filter level log).
const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ options, value, onChange, label, className, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      className={classNames(
        "inline-flex overflow-hidden rounded-[3px] border border-ctrl-border",
        className,
      )}
      {...props}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={classNames(
              "h-7 min-w-13 border-r border-ctrl-border px-2.5 font-mono text-[11px] font-medium last:border-r-0",
              {
                "bg-lvl-on-bg text-lvl-on-fg": isActive,
                "bg-ctrl text-fg": !isActive,
              },
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  ),
);

SegmentedControl.displayName = "SegmentedControl";

export default SegmentedControl;
