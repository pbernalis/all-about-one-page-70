// Text-to-Speech utility functions
export function speak(text: string, lang = "el-GR") {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this browser");
    return;
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1.0;   // 0.1–10
  utterance.pitch = 1.0;  // 0–2
  utterance.volume = 0.8; // 0–1
  
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeakingSupported() {
  return "speechSynthesis" in window;
}

export function getSpeechVoices(lang?: string) {
  if (!("speechSynthesis" in window)) return [];
  
  const voices = window.speechSynthesis.getVoices();
  
  if (lang) {
    return voices.filter(voice => voice.lang.startsWith(lang));
  }
  
  return voices;
}