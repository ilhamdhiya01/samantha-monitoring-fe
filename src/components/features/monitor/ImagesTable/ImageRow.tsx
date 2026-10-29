import classNames from "classnames";
import React from "react";

import Button from "@/components/ui/button";
import { V11_ACTION_HINT } from "@/const/monitor.constant";
import {
  formatBytes,
  formatDateTime,
  shortImageId,
} from "@/lib/helpers/format.helper";
import { getStatusTone } from "@/lib/helpers/threshold.helper";
import type { ImageInfo } from "@/lib/types/image.types";

const USED_BY_COLOR = {
  ok: "text-ok",
  warn: "text-warn-fg",
  err: "text-err",
  muted: "text-muted",
};

const CELL = "px-3 py-1.5";
const MONO = "font-mono text-xs";

interface ImageRowProps {
  image: ImageInfo;
}

const ImageRow = React.memo(({ image }: ImageRowProps) => {
  const user = image.usedBy.at(0);

  return (
    <tr className="border-b border-line-soft">
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
      <td
        className={classNames(
          CELL,
          USED_BY_COLOR[user ? getStatusTone(user.status) : "muted"],
        )}
      >
        {user
          ? image.usedBy
              .map((container) => `${container.name} (${container.status})`)
              .join(", ")
          : image.state === "dangling"
            ? "dangling"
            : "—"}
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
  );
});

ImageRow.displayName = "ImageRow";

export default ImageRow;
