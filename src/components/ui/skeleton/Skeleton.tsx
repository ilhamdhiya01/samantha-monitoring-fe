import classNames from "classnames";
import React, { forwardRef } from "react";

const Skeleton = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden
    className={classNames("animate-pulse rounded-[3px] bg-track", className)}
    {...props}
  />
));

Skeleton.displayName = "Skeleton";

export default Skeleton;
