import classNames from "classnames";
import React, { forwardRef } from "react";

interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ label, className, ...props }, ref) => (
    <label
      className={classNames(
        "flex h-7 items-center rounded-[3px] border border-ctrl-border bg-ctrl px-2",
        className,
      )}
    >
      <span className="sr-only">{label}</span>
      <input
        ref={ref}
        type="search"
        className="min-w-0 flex-1 border-0 bg-transparent font-mono text-xs text-fg outline-none"
        {...props}
      />
    </label>
  ),
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
