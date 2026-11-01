import { describe, expect, it } from "vitest";

import type { ImageInfo } from "@/lib/types/image.types";

import { getImageSizeByContainer } from "../image.helper";

const image = (sizeBytes: number, usedBy: string[]): ImageInfo => ({
  id: `sha256:${sizeBytes}`,
  repository: "goodenglish-be",
  tag: usedBy.length > 0 ? "test" : null,
  sizeBytes,
  createdAt: "2026-10-29T00:00:00.000Z",
  deployedAt: null,
  state: usedBy.length > 0 ? "active" : "dangling",
  usedBy: usedBy.map((name) => ({ name, status: "running", exitCode: null })),
});

describe("image.helper", () => {
  it("maps each container to the size of the image it uses", () => {
    const sizes = getImageSizeByContainer([
      image(212, ["goodenglish-be-app-1"]),
      image(640, ["goodenglish-be-migrate-1", "goodenglish-be-seed-1"]),
      image(410, []),
    ]);

    expect(sizes.get("goodenglish-be-app-1")).toBe(212);
    expect(sizes.get("goodenglish-be-seed-1")).toBe(640);
    expect(sizes.size).toBe(3);
  });
});
