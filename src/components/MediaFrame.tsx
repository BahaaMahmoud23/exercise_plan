import { useEffect, useRef } from "react";

type MediaFrameProps = {
  src: string;
  poster?: string;
  title: string;
  className?: string;
};

export function MediaFrame({ src, poster, title, className = "" }: MediaFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackLabel = title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    delete video.dataset.missing;
    video.load();

    const playPromise = video.play();

    if (playPromise) {
      playPromise.catch(() => {
        // Mobile browsers can defer autoplay briefly. The video remains visible and user-tappable.
      });
    }
  }, [src]);

  return (
    <div className={`media-frame ${className}`} aria-label={`${title} media`}>
      <video
        key={src}
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        controls
        onCanPlay={(event) => {
          delete event.currentTarget.dataset.missing;
        }}
        onLoadStart={(event) => {
          delete event.currentTarget.dataset.missing;
        }}
        onError={(event) => {
          event.currentTarget.dataset.missing = "true";
        }}
      />
      <div className="media-placeholder" aria-hidden="true">
        <span>{fallbackLabel}</span>
        <small>Demo placeholder</small>
      </div>
    </div>
  );
}
