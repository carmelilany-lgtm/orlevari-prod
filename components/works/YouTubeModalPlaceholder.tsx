"use client";

/**
 * Placeholder for future YouTube lightbox / modal player.
 * Will receive youtubeId and open/close state from parent.
 */
export interface YouTubeModalPlaceholderProps {
  youtubeId?: string;
  title: string;
  open: boolean;
  onClose: () => void;
}

export function YouTubeModalPlaceholder({
  youtubeId,
  title,
  open,
  onClose,
}: YouTubeModalPlaceholderProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="card-surface max-w-2xl rounded-2xl p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-zinc-300">
          YouTube player — {youtubeId ?? "no ID yet"}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-full bg-zinc-800 px-6 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
