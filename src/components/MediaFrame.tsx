import { useEffect, useRef, useState } from "react";

type MediaFrameProps = { src: string; poster?: string; title: string; className?: string };

export function MediaFrame(props: MediaFrameProps) {
  // Remount the player when switching exercises to release the previous resource.
  return <VideoPlayer key={props.src} {...props} />;
}

function VideoPlayer({ src, title, className = "" }: MediaFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opened, setOpened] = useState(false);
  const [missing, setMissing] = useState(false);
  const [ratio, setRatio] = useState(16 / 10);

  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [opened]);

  return <div className={`media-frame ${className}`} style={{ aspectRatio: Math.max(ratio, 0.85) }} aria-label={`${title} media`}>
    {opened && src ? <>
      <video ref={videoRef} src={src} controls playsInline preload="metadata"
        aria-label={`${title} demonstration`}
        onLoadedMetadata={event => {
          const video = event.currentTarget;
          if (video.videoWidth && video.videoHeight) setRatio(video.videoWidth / video.videoHeight);
        }}
        onError={() => setMissing(true)} />
      <button className="video-close" type="button" onClick={() => { setOpened(false); setMissing(false); }}>Close video</button>
      {missing && <div className="video-message" role="status">Video unavailable. Check your connection.<button type="button" className="back-button" onClick={() => { setMissing(false); videoRef.current?.load(); }}>Retry</button></div>}
    </> : <div className="video-idle">
      {src ? <button type="button" className="back-button" onClick={() => setOpened(true)}>Load {title} video</button> : <span>Demo unavailable</span>}
    </div>}
  </div>;
}
