import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  src: string;
  isPlaying: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, isPlaying }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);
  return <video ref={videoRef} src={src} loop playsInline />;
};
export default VideoPlayer;
