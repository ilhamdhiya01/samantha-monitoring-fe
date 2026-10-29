import React from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = React.memo(
  ({ title, description, action }: EmptyStateProps) => (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-20 text-center">
      <h1 className="m-0 text-sm font-semibold">{title}</h1>
      {description && (
        <p className="m-0 max-w-sm text-xs text-muted">{description}</p>
      )}
      {action}
    </div>
  ),
);

EmptyState.displayName = "EmptyState";

export default EmptyState;
