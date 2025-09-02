import React, { useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechToText } from "@/hooks/useSpeechToText";

interface MicButtonProps {
  onTranscript: (text: string) => void;     // καλείται με το transcript
  lang?: string;                            // "el-GR" by default
  autoUpdate?: boolean;                     // true => καλεί onTranscript σε real-time
  disabled?: boolean;
  className?: string;
}

export const MicButton: React.FC<MicButtonProps> = ({ 
  onTranscript, 
  lang = "el-GR", 
  autoUpdate = true,
  disabled = false,
  className = ""
}) => {
  const { isSupported, isListening, transcript, error, toggle, reset } = useSpeechToText({
    lang,
    interim: true,
    continuous: false
  });

  // Όταν έχουμε transcript και autoUpdate, στέλνουμε το κείμενο
  useEffect(() => {
    if (transcript && autoUpdate) {
      onTranscript(transcript);
    }
  }, [transcript, autoUpdate, onTranscript]);

  // Όταν σταματήσει η αναγνώριση και έχουμε transcript, στέλνουμε το τελικό
  useEffect(() => {
    if (!isListening && transcript && !autoUpdate) {
      onTranscript(transcript);
    }
  }, [isListening, transcript, autoUpdate, onTranscript]);

  if (!isSupported) {
    return (
      <Button 
        variant="ghost" 
        size="icon"
        disabled
        title="Speech recognition not supported"
        className={`opacity-50 cursor-not-allowed ${className}`}
      >
        <MicOff className="h-4 w-4" />
      </Button>
    );
  }

  const handleClick = () => {
    if (isListening) {
      toggle(); // stop
    } else {
      reset(); // clear previous transcript
      toggle(); // start
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={disabled}
      title={isListening ? "Stop recording" : "Start voice input"}
      className={`${isListening ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-primary"} ${className}`}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};