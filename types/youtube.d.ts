interface YT {
  Player: new (
    elementId: string,
    config: {
      height: string | number;
      width: string | number;
      videoId: string;
      playerVars?: {
        autoplay?: 0 | 1;
        controls?: 0 | 1;
        loop?: 0 | 1;
        playlist?: string;
      };
      events?: {
        onReady?: (event: { target: YT.Player }) => void;
      };
    }
  ) => void;
}

interface YTPlayer {
  destroy(): void;
  setVolume(volume: number): void;
}

interface Window {
  YT: YT;
  onYouTubeIframeAPIReady?: () => void;
}
