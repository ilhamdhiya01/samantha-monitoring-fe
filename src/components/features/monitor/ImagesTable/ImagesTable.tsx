import React from "react";

import SectionMessage from "@/components/shared/section-message";
import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import { V11_ACTION_HINT } from "@/const/monitor.constant";
import { formatBytes } from "@/lib/helpers/format.helper";
import { useImages } from "@/lib/hooks/images/useImages";

import ImageRow from "./ImageRow";

// Header menempel di atas saat tabel di-scroll. Garis bawahnya lewat
// shadow: border pada sel sticky ikut hilang di tabel border-collapse.
const HEAD =
  "sticky top-0 z-10 bg-panel px-3 py-1.75 font-medium whitespace-nowrap shadow-[0_1px_0] shadow-line-soft";

const ImagesTable = React.memo(() => {
  const { data: summary, isLoading, isError } = useImages();

  return (
    <section
      id="images"
      aria-label="Images dan riwayat deploy"
      className="border-t border-line bg-panel"
    >
      <div className="flex flex-wrap items-baseline gap-3 border-b border-line px-4 py-2.5">
        <h2 className="m-0 text-xs font-semibold">
          Images &amp; riwayat deploy
        </h2>
        {summary && (
          <span className="text-[11px] text-muted">
            docker images · {summary.totalCount} image,{" "}
            {formatBytes(summary.totalBytes)} · {summary.danglingCount} dangling
            ({formatBytes(summary.danglingBytes)})
          </span>
        )}
        <span className="flex-1" />
        {/* Prune = aksi tulis, masuk v1.1. */}
        <Button disabled title={V11_ACTION_HINT}>
          docker image prune
        </Button>
      </div>

      {isError && (
        <SectionMessage tone="danger" className="px-4">
          Gagal memuat daftar image.
        </SectionMessage>
      )}
      {!isError && (isLoading || !summary) && (
        <div className="flex flex-col gap-2 p-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-5" />
          ))}
        </div>
      )}
      {summary && summary.images.length === 0 && (
        <SectionMessage className="px-4">Belum ada image.</SectionMessage>
      )}
      {summary && summary.images.length > 0 && (
        // Tinggi dibatasi: VPS dengan puluhan image tidak memanjangkan
        // halaman; sisanya di-scroll (horizontal juga di layar sempit).
        <div className="max-h-120 overflow-auto">
          <table className="w-full min-w-240 border-collapse text-[12.5px]">
            <thead>
              <tr className="text-left text-[11px] text-muted">
                <th scope="col" className={`${HEAD} px-4`}>
                  REPOSITORY
                </th>
                <th scope="col" className={HEAD}>
                  TAG
                </th>
                <th scope="col" className={HEAD}>
                  IMAGE ID
                </th>
                <th scope="col" className={`${HEAD} text-right`}>
                  SIZE
                </th>
                <th scope="col" className={HEAD}>
                  DEPLOYED
                </th>
                <th scope="col" className={HEAD}>
                  DIPAKAI OLEH
                </th>
                <th scope="col" className={`${HEAD} px-4`}>
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {summary.images.map((image) => (
                <ImageRow key={image.id} image={image} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
});

ImagesTable.displayName = "ImagesTable";

export default ImagesTable;
