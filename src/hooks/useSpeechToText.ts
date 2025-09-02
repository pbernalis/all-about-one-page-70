import { useEffect, useMemo, useRef, useState } from "react";

type Opts = { lang?: string; interim?: boolean; continuous?: boolean; };
type SpeechState = {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  error: string | null;
  start: () => void;
  stop: () => void;
  toggle: () => void;
  reset: () => void;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

export function useSpeechToText(opts: Opts = {}): SpeechState {
  const { lang = "el-GR", interim = true, continuous = false } = opts;

  const Recognition = useMemo(() => {
    if (typeof window === "undefined") return undefined as any;
    return (window.SpeechRecognition || window.webkitSpeechRecognition) as any;
  }, []);

  const [isSupported] = useState(!!Recognition);
  const [isListening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recogRef = useRef<any>(null);
  const finalRef = useRef("");

  useEffect(() => {
    if (!isSupported) return;

    const r = new Recognition();
    r.lang = lang;
    r.interimResults = interim;
    r.continuous = continuous;

    r.onresult = (e: any) => {
      let interimStr = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalRef.current += res[0].transcript;
        else interimStr += res[0].transcript;
      }
      setTranscript((finalRef.current + " " + interimStr).trim());
    };

    r.onerror = (e: any) => {
      setError(e?.error ?? "speech-error");
      setListening(false);
    };

    r.onend = () => setListening(false);

    recogRef.current = r;
    return () => { try { r.abort(); } catch {} };
  }, [Recognition, isSupported, lang, interim, continuous]);

  const start = () => {
    if (!isSupported || !recogRef.current) return;
    setError(null);
    finalRef.current = "";
    setTranscript("");
    setListening(true);
    recogRef.current.start(); // needs HTTPS or localhost + user gesture
  };

  const stop = () => {
    if (!isSupported || !recogRef.current) return;
    try { recogRef.current.stop(); } catch {}
  };

  const reset = () => {
    finalRef.current = "";
    setTranscript("");
    setError(null);
  };

  const toggle = () => (isListening ? stop() : start());

  return { isSupported, isListening, transcript, error, start, stop, toggle, reset };
}