import classNames from "classnames";
import React from "react";

import Button from "@/components/ui/button";
import { V11_ACTION_HINT } from "@/const/monitor.constant";
import {
  formatBytes,
  formatDateTime,
  shortImageId,
} from "@/lib/helpers/format.helper";
import type {Tone} from "@/lib/helpers/threshold.helper";
import {
  getStatusLabel,
  getStatusTone
} from "@/lib/helpers/threshold.helper";
import type { ImageInfo } from "@/lib/types/image.types";

const TONE_TEXT: Record<Tone, string> = {
  ok: "text-ok",
  warn: "text-warn-fg",
  err: "text-err",
  muted: "text-muted",
};

// Angka, tag, id dan tanggal tidak boleh pecah baris; tabel digeser
// horizontal di layar sempit.
const CELL = "px-3 py-1.5 whitespace-nowrap";
const MONO = "font-mono text-xs";

const EMPTY_LABEL: Partial<Record<ImageInfo["state"], string>> = {
  dangling: "dangling",
  unused: "tidak dipakai",
};

interface ImageRowProps {
  image: ImageInfo;
}

const ImageRow = React.memo(({ image }: ImageRowProps) => (
  <tr className="border-b border-line-soft align-top">
    <td className={classNames("px-4 py-1.5", MONO)}>{image.repository}</td>
    <td
      className={classNames(CELL, MONO, {
        "font-medium": image.state === "active",
        "text-muted": image.state === "dangling",
      })}
    >
      {image.tag ?? "<none>"}
    </td>
    <td className={classNames(CELL, MONO, "text-muted")}>
      {shortImageId(image.id)}
    </td>
    <td className={classNames(CELL, MONO, "text-right")}>
      {formatBytes(image.sizeBytes)}
    </td>
    <td className={classNames(CELL, "text-fg-secondary")}>
      {image.deployedAt ? formatDateTime(image.deployedAt) : "—"}
    </td>
    {/* Satu container per baris; kolom ini boleh melebar/membungkus. */}
    <td className="px-3 py-1.5">
      {image.usedBy.length > 0 ? (
        <ul className="m-0 list-none p-0">
          {image.usedBy.map((user) => (
            <li
              key={user.name}
              className={TONE_TEXT[getStatusTone(user.status, user.exitCode)]}
            >
              {user.name}{" "}
              <span className="text-[11px]">
                ({getStatusLabel(user.status, user.exitCode)})
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-muted">{EMPTY_LABEL[image.state] ?? "—"}</span>
      )}
    </td>
    <td className="px-4 py-1.5 text-right">
      {image.state === "previous" && (
        // Rollback = aksi tulis, masuk v1.1.
        <Button size="xs" disabled title={V11_ACTION_HINT}>
          rollback
        </Button>
      )}
    </td>
  </tr>
));

ImageRow.displayName = "ImageRow";

export default ImageRow;
