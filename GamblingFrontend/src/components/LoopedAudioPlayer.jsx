// components/LoopedAudioPlayer.jsx
import { useEffect, useRef } from "react";

const LoopedAudioPlayer = ({ src }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audioRef.current = audio;

    // Try to play on mount
    audio.play().catch((err) => {
      console.warn("Audio autoplay blocked:", err);
    });

    return () => {
      // Pause and clean up on unmount
      audio.pause();
      audio.currentTime = 0;
    };
  }, [src]);

  return null; // no UI
};

export default LoopedAudioPlayer;
