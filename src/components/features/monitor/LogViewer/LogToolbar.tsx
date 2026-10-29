import { useNavigate } from "@tanstack/react-router";
import React, { useCallback, useEffect, useState } from "react";

import SearchInput from "@/components/ui/search-input";
import type { SegmentedOption } from "@/components/ui/segmented-control";
import SegmentedControl from "@/components/ui/segmented-control";
import {
  LOG_LEVEL_FILTERS,
  LOG_TAIL,
  SEARCH_DEBOUNCE_MS,
} from "@/const/monitor.constant";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { LogLevel, LogLevelFilter } from "@/lib/types/log.types";

const LEVEL_OPTIONS: SegmentedOption[] = LOG_LEVEL_FILTERS.map((level) => ({
  value: level,
  label: level,
}));

interface LogToolbarProps {
  level: LogLevelFilter;
  query: string;
  matchCount: number;
}

// Filter level dan pencarian disimpan di URL (?level=ERROR&q=timeout).
const LogToolbar = React.memo(
  ({ level, query, matchCount }: LogToolbarProps) => {
    const navigate = useNavigate({ from: "/containers/$name" });
    const [draft, setDraft] = useState(query);
    const debouncedDraft = useDebounce(draft, SEARCH_DEBOUNCE_MS);

    useEffect(() => {
      if (debouncedDraft === query) return;
      void navigate({
        search: (prev) => ({ ...prev, q: debouncedDraft || undefined }),
        replace: true,
      });
    }, [debouncedDraft, query, navigate]);

    const handleLevelChange = useCallback(
      (value: string) => {
        void navigate({
          search: (prev) => ({
            ...prev,
            level: value === "ALL" ? undefined : (value as LogLevel),
          }),
          replace: true,
        });
      },
      [navigate],
    );

    const handleSearchChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) =>
        setDraft(event.target.value),
      [],
    );

    return (
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-panel-alt px-4 py-2">
        <SegmentedControl
          label="Filter level"
          options={LEVEL_OPTIONS}
          value={level}
          onChange={handleLevelChange}
        />
        <SearchInput
          label="Cari di log"
          placeholder="grep…"
          value={draft}
          onChange={handleSearchChange}
          className="flex-[1_1_200px]"
        />
        <span className="font-mono text-[11px] text-muted">
          tail {LOG_TAIL} · {matchCount} cocok
        </span>
      </div>
    );
  },
);

LogToolbar.displayName = "LogToolbar";

export default LogToolbar;
