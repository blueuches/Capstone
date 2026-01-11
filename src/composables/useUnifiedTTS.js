// src/composables/useUnifiedTTS.js
import { Capacitor } from '@capacitor/core';
import { useWebTTS } from './useWebTTS';
import { useNativeTTS } from './useNativeTTS';

export function useUnifiedTTS() {
  const isNative = Capacitor.isNativePlatform();

  const nativeTTS = useNativeTTS();
  const webTTS = useWebTTS();

  const modeLabel = isNative
    ? 'Native TTS (with web fallback)'
    : 'Web TTS (speechSynthesis)';

  const supported = () => {
    if (isNative) return true; // plugin installed, so assume yes
    return webTTS.supported();
  };

  const speak = async (text) => {
    if (!text || !text.trim()) return;

    if (isNative) {
      try {
        await nativeTTS.speak(text);
        return;
      } catch (err) {
        console.warn('Native TTS failed, falling back to web TTS:', err);
      }
    }

    if (webTTS.supported()) {
      await webTTS.speak(text);
    } else {
      console.warn('No TTS available (native + web both failed).');
    }
  };

  const stop = async () => {
    if (isNative) {
      await nativeTTS.stop();
    }
    if (webTTS.supported()) {
      webTTS.stop();
    }
  };

  return {
    speak,
    stop,
    supported,
    modeLabel
  };
}
