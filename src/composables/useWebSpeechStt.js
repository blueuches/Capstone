// src/composables/useWebSpeechStt.js
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

export function useWebSpeechStt() {
  const supported = ref(true);
  const listening = ref(false);
  const interimTranscript = ref('');
  const finalTranscript = ref('');
  const logText = ref('');
  const autoRestart = ref(true);
  const lang = ref('en-US');

  let recognition = null;
  let restartTimeout = null;
  const RESTART_DEBOUNCE_MS = 300;

  function log(msg) {
    const t = new Date().toLocaleTimeString();
    logText.value = `[${t}] ${msg}\n` + logText.value;
  }

  onMounted(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      supported.value = false;
      log('SpeechRecognition API not available in this browser.');
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = lang.value;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      listening.value = true;
      log('Recognition started.');
    };

    recognition.onerror = (evt) => {
      log('Error: ' + (evt.error || JSON.stringify(evt)));
    };

    recognition.onend = () => {
      listening.value = false;
      log('Recognition ended.');
      if (autoRestart.value) {
        if (restartTimeout) clearTimeout(restartTimeout);
        restartTimeout = setTimeout(() => {
          try {
            recognition.lang = lang.value;
            recognition.start();
          } catch (e) {
            log('Restart error: ' + e.message);
          }
        }, RESTART_DEBOUNCE_MS);
      }
    };

    recognition.onresult = (evt) => {
      let interim = '';
      let final = '';
      for (let i = evt.resultIndex; i < evt.results.length; ++i) {
        const res = evt.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }
      interimTranscript.value = interim.trim();
      if (final.trim()) {
        finalTranscript.value = (finalTranscript.value + ' ' + final).trim();
        interimTranscript.value = '';
        log('Final received: ' + final);
      } else {
        log('Interim: ' + interim);
      }
    };
  });

  onBeforeUnmount(() => {
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {}
      recognition = null;
    }
    if (restartTimeout) clearTimeout(restartTimeout);
  });

  watch(lang, (newLang) => {
    if (recognition) recognition.lang = newLang;
    log('Language changed to ' + newLang);
  });

  function start() {
    if (!recognition) {
      log('SpeechRecognition not supported or not initialized.');
      return;
    }
    try {
      recognition.lang = lang.value;
      recognition.start();
    } catch (e) {
      log('Start error: ' + e.message);
    }
  }

  function stop() {
    if (!recognition) return;
    autoRestart.value = false;
    try {
      recognition.stop();
    } catch (e) {
      log('Stop error: ' + e.message);
    }
  }

  function clear() {
    finalTranscript.value = '';
    interimTranscript.value = '';
    log('Transcripts cleared.');
  }

  async function sendToBackend(providedText) {
    const text = providedText || finalTranscript.value;
    if (!text || !text.trim()) {
      log('No text to send.');
      return;
    }
    log('Sending to backend: ' + text);
    try {
      const res = await fetch('/stt-to-rasa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      log('Backend response: ' + JSON.stringify(data));
    } catch (err) {
      log('Network error: ' + err.message);
    }
  }

  return {
    supported,
    listening,
    interimTranscript,
    finalTranscript,
    logText,
    autoRestart,
    lang,
    start,
    stop,
    clear,
    sendToBackend
  };
}
