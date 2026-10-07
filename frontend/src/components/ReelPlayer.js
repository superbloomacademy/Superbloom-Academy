"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

// Portrait video that plays in place. The file is only fetched once the visitor presses play.
export default function ReelPlayer({ src, poster, label }) {
  const video = useRef(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    setStarted(true);
    video.current?.play();
  };

  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] bg-black ring-4 ring-white/15">
      <video
        ref={video}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        muted
        loop
        controls={started}
        aria-label={label}
        className="h-full w-full object-cover"
      />
      {!started && (
        <button
          type="button"
          onClick={start}
          aria-label={`Play video: ${label}`}
          className="group absolute inset-0 flex items-center justify-center bg-ink/25"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-bloom text-ink shadow-lg transition-transform duration-200 ease-out-strong group-hover:scale-110 group-active:scale-95">
            <Play size={32} aria-hidden className="translate-x-0.5 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
