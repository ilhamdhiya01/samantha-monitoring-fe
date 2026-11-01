import React, { useCallback, useEffect, useId, useRef, useState } from "react";

import Button from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: React.ReactNode;
  // Teks yang harus diketik persis sebelum tombol konfirmasi aktif.
  confirmValue: string;
  confirmLabel: string;
  // Tombol konfirmasi merah untuk aksi yang merusak/menghentikan.
  danger?: boolean;
  isPending?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

interface ConfirmFormProps extends Omit<ConfirmDialogProps, "open"> {
  titleId: string;
}

// Dipasang ulang setiap dialog dibuka → isian selalu mulai kosong.
const ConfirmForm = ({
  titleId,
  title,
  description,
  confirmValue,
  confirmLabel,
  danger = false,
  isPending = false,
  error,
  onConfirm,
  onClose,
}: ConfirmFormProps) => {
  const [typed, setTyped] = useState("");
  const inputId = useId();
  const matches = typed === confirmValue;

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (matches && !isPending) onConfirm();
    },
    [matches, isPending, onConfirm],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h2 id={titleId} className="m-0 text-sm font-semibold">
        {title}
      </h2>
      <div className="text-xs text-fg-secondary">{description}</div>
      <label htmlFor={inputId} className="text-xs text-muted">
        Ketik <span className="font-mono text-fg">{confirmValue}</span> untuk
        melanjutkan
      </label>
      <input
        id={inputId}
        autoFocus
        autoComplete="off"
        spellCheck={false}
        value={typed}
        onChange={(event) => setTyped(event.target.value)}
        className="h-8 w-full rounded-[3px] border border-ctrl-border bg-ctrl px-2 font-mono text-xs text-fg outline-none focus:border-sel-border"
      />
      {error && (
        <p role="alert" className="m-0 text-xs text-err">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button onClick={onClose} disabled={isPending}>
          Batal
        </Button>
        <Button
          type="submit"
          tone={danger ? "danger" : "default"}
          disabled={!matches || isPending}
        >
          {isPending ? "Memproses…" : confirmLabel}
        </Button>
      </div>
    </form>
  );
};

// Konfirmasi aksi berisiko dengan mengetik ulang nama targetnya. Native
// <dialog>: fokus terkunci di dalam, Esc menutup, backdrop dari browser.
const ConfirmDialog = React.memo(({ open, ...props }: ConfirmDialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={props.onClose}
      className="m-auto w-[min(420px,calc(100vw-32px))] rounded-[4px] border border-line bg-panel p-4 text-fg backdrop:bg-bg/80"
    >
      {open && <ConfirmForm titleId={titleId} {...props} />}
    </dialog>
  );
});

ConfirmDialog.displayName = "ConfirmDialog";

export default ConfirmDialog;
