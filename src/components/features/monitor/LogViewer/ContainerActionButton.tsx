import React, { useCallback, useState } from "react";

import ConfirmDialog from "@/components/shared/confirm-dialog";
import Button from "@/components/ui/button";
import { getActionAvailability } from "@/lib/helpers/action.helper";
import { useActionStatus } from "@/lib/hooks/actions/useActionStatus";
import { useContainerAction } from "@/lib/hooks/actions/useContainerAction";
import type { ContainerInfo } from "@/lib/types/container.types";

const COPY = {
  stop: {
    button: "Stop",
    title: "Hentikan container?",
    confirm: "Stop container",
    description: (name: string) => (
      <>
        <span className="font-mono">{name}</span> dihentikan (SIGTERM, lalu
        SIGKILL setelah 10 detik). Restart policy tidak menyalakannya lagi
        sampai di-start manual. Aksi dicatat di audit log.
      </>
    ),
  },
  start: {
    button: "Start",
    title: "Jalankan container?",
    confirm: "Start container",
    description: (name: string) => (
      <>
        <span className="font-mono">{name}</span> dijalankan lagi dengan
        konfigurasi yang sama. Aksi dicatat di audit log.
      </>
    ),
  },
} as const;

interface ContainerActionButtonProps {
  info: ContainerInfo;
}

// Stop/start dengan konfirmasi ketik nama. Tombol tetap terlihat saat
// tidak tersedia (disabled + alasan di tooltip), supaya jelas kenapa.
const ContainerActionButton = React.memo(
  ({ info }: ContainerActionButtonProps) => {
    const { data: status } = useActionStatus();
    const mutation = useContainerAction();
    const [isOpen, setIsOpen] = useState(false);
    const { action, disabledReason } = getActionAvailability(info, status);
    const copy = COPY[action];

    const { reset, mutate } = mutation;
    const handleOpen = useCallback(() => {
      reset();
      setIsOpen(true);
    }, [reset]);
    const handleClose = useCallback(() => setIsOpen(false), []);
    const handleConfirm = useCallback(
      () =>
        mutate(
          { container: info.name, action },
          { onSuccess: () => setIsOpen(false) },
        ),
      [mutate, info.name, action],
    );

    return (
      <>
        <Button
          tone={action === "stop" ? "danger" : "default"}
          onClick={handleOpen}
          disabled={disabledReason !== null}
          title={disabledReason ?? `${copy.button} ${info.name}`}
        >
          {copy.button}
        </Button>
        <ConfirmDialog
          open={isOpen}
          title={copy.title}
          description={copy.description(info.name)}
          confirmValue={info.name}
          confirmLabel={copy.confirm}
          danger={action === "stop"}
          isPending={mutation.isPending}
          error={mutation.error?.message ?? null}
          onConfirm={handleConfirm}
          onClose={handleClose}
        />
      </>
    );
  },
);

ContainerActionButton.displayName = "ContainerActionButton";

export default ContainerActionButton;
