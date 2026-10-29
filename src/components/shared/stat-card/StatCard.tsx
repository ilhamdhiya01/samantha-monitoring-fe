import classNames from "classnames";
import React from "react";

import Meter from "@/components/ui/meter";
import type { Tone } from "@/lib/helpers/threshold.helper";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  note?: React.ReactNode;
  // 0–100, panjang garis meter.
  percent: number;
  tone: Tone;
}

const NOTE_TONE: Record<Tone, string> = {
  ok: "text-ok",
  warn: "text-warn-fg",
  err: "text-err",
  muted: "text-muted",
};

// Kartu resource VPS: label, angka, catatan berwarna, garis meter.
const StatCard = React.memo(
  ({ label, value, note, percent, tone }: StatCardProps) => (
    <div className="flex min-w-0 flex-col gap-0.75 border-r border-b border-line-soft px-5 py-3">
      <span className="text-[11px] text-muted">{label}</span>
      <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
        <span className="font-mono text-lg font-medium tracking-[-0.01em] whitespace-nowrap">
          {value}
        </span>
        {note && (
          <span className={classNames("text-[11px]", NOTE_TONE[tone])}>
            {note}
          </span>
        )}
      </span>
      <Meter value={percent} tone={tone} label={label} className="mt-0.5" />
    </div>
  ),
);

StatCard.displayName = "StatCard";

export default StatCard;
