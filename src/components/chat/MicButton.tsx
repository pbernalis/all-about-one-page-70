import React, { useEffect } from "react";
import { useSpeechToText } from "@/hooks/useSpeechToText";

type Props = {
  onTranscript: (text: string) => void; // update chat input
  lang?: string;
  autoUpdate?: boolean;
  disabled?: boolean;
  className?: string;
};

export const MicButton: React.FC<Props> = ({
  onTranscript,
  lang = "el-GR",
  autoUpdate = true,
  disabled = false,
  className = "",
}) => {
  const { isSupported, isListening, transcript, toggle, reset } =
    useSpeechToText({ lang, interim: true, continuous: false });

  useEffect(() => {
    if (transcript && autoUpdate) onTranscript(transcript);
  }, [transcript, autoUpdate, onTranscript]);

  if (!isSupported) {
    return (
      <button
        className={`px-3 h-9 rounded-xl border opacity-50 cursor-not-allowed ${className}`}
        title="Speech recognition not supported in this browser"
        disabled
      >
        🎤
      </button>
    );
  }

  const handleClick = () => {
    if (disabled) return;
    if (isListening) toggle();
    else { reset(); toggle(); }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-3 h-9 rounded-xl border bg-white hover:bg-muted transition ${className}`}
      aria-pressed={isListening}
      title={isListening ? "Stop" : "Speak"}
      disabled={disabled}
    >
      {isListening ? "🎙️" : "🎤"}
    </button>
  );
};

export default MicButton;