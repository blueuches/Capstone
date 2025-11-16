// src/composables/useNativeTTS.js
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

export function useNativeTTS() {
  const isNative = Capacitor.isNativePlatform();

  const supported = () => isNative;

  /**
   * Speak with native TTS.
   * @param {string} text - text to speak
   * @param {object} opts - optional { lang, rate, pitch, volume }
   */
  const speak = async (text, opts = {}) => {
    if (!text || !text.trim()) return;
    if (!isNative) {
      console.warn('Native TTS called on web');
      return;
    }

    const {
      lang = 'id-ID',   // try Bahasa Indonesia by default
      rate = 1.0,
      pitch = 1.2,      // slightly higher pitch = “more feminine”
      volume = 1.0
    } = opts;

    try {
      await TextToSpeech.speak({
        text,
        lang,
        rate,
        pitch,
        volume,
        category: 'ambient'
      });
    } catch (err) {
      console.error('Native TTS error:', err);
      throw err;
    }
  };

  const stop = async () => {
    if (!isNative) return;
    try {
      await TextToSpeech.stop();
    } catch (err) {
      console.error('Native TTS stop error:', err);
    }
  };

  return {
    speak,
    stop,
    supported,
    type: 'native'
  };
}
