import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  audioUrl?: string;
}

const AudioPlayer = ({ audioUrl }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!audioUrl) return;

    audioRef.current = new Audio(audioUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    // Try autoplay
    const tryAutoplay = async () => {
      try {
        await audioRef.current?.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Autoplay blocked. Waiting for user interaction.");
      }
    };

    tryAutoplay();

    // Play on first user interaction
    const handleInteraction = async () => {
      if (!hasInteracted && audioRef.current && !isPlaying) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setHasInteracted(true);
        } catch (error) {
          console.error("Failed to play audio:", error);
        }
      }
    };

    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("keydown", handleInteraction, { once: true });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, [audioUrl, hasInteracted, isPlaying]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        setHasInteracted(true);
      }
    } catch (error) {
      console.error("Failed to toggle audio:", error);
    }
  };

  if (!audioUrl) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        size="icon"
        variant="outline"
        onClick={togglePlay}
        className="h-12 w-12 rounded-full bg-card/90 backdrop-blur-sm border-primary hover:bg-primary hover:scale-110 transition-all shadow-glow-orange"
      >
        {isPlaying ? (
          <Volume2 className="h-5 w-5 text-primary" />
        ) : (
          <VolumeX className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};

export default AudioPlayer;
