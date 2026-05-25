"use client";

/**
 * Placeholder for future stills lightbox gallery.
 */
export interface StillsLightboxPlaceholderProps {
  stillId: string;
  title: string;
  open: boolean;
  onClose: () => void;
}

export function StillsLightboxPlaceholder({
  stillId,
  title,
  open,
  onClose,
}: StillsLightboxPlaceholderProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      <div
        className="aspect-[4/3] w-full max-w-3xl rounded-xl card-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full min-h-[240px] items-center justify-center text-zinc-500">
          Lightbox — {stillId}
        </div>
      </div>
    </div>
  );
}
