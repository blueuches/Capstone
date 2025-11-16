<template>
  <div class="test1 p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">STT Test (Web / Native)</h1>

    <!-- STT mode label -->
    <div class="mb-2 text-sm text-gray-700">
      <strong>STT Mode:</strong> {{ sttModeLabel }}
    </div>

    <!-- TTS mode label + test buttons -->
    <div class="mb-4 text-sm text-gray-700 flex items-center gap-2">
      <span><strong>TTS Mode:</strong> {{ ttsModeLabel }}</span>
      <button
        @click="sayHello"
        class="px-3 py-1 bg-emerald-600 text-white rounded text-xs"
      >
        Test TTS
      </button>
      <button
        @click="ttsStop"
        class="px-3 py-1 bg-gray-300 rounded text-xs"
      >
        Stop TTS
      </button>
    </div>

    <div class="controls mb-4 flex gap-2 items-center">
      <button
        @click="sttStart"
        :disabled="listening"
        class="px-3 py-1 rounded bg-emerald-600 text-white"
      >
        Start
      </button>
      <button
        @click="sttStop"
        :disabled="!listening"
        class="px-3 py-1 rounded bg-gray-300"
      >
        Stop
      </button>

      <!-- Auto-restart only for Web Speech -->
      <label v-if="hasAutoRestart" class="ml-4 flex items-center gap-2">
        <input type="checkbox" v-model="autoRestart" />
        <span>Auto-restart (continuous)</span>
      </label>

      <label class="ml-4 flex items-center gap-2">
        Language
        <select v-model="lang" class="ml-2 px-2 py-1 border rounded">
          <option value="en-US">English (en-US)</option>
          <option value="ceb-PH">Cebuano (ceb-PH)</option>
          <option value="fil-PH">Filipino (fil-PH)</option>
          <option value="en-GB">English (UK)</option>
        </select>
      </label>
    </div>

    <div class="status mb-4">
      <strong>Status:</strong>
      <span v-if="!sttSupported" class="text-red-600">
        Speech recognition not supported in this mode.
      </span>
      <span v-else-if="listening" class="text-emerald-600">Listening…</span>
      <span v-else class="text-gray-600">Idle</span>
    </div>

    <div class="transcripts mb-4">
      <h2 class="font-semibold mb-2">Final transcript</h2>
      <div class="final p-3 border rounded min-h-[64px] bg-gray-50">
        {{ finalTranscript || '—' }}
      </div>

      <h3 class="font-semibold mt-3 mb-2">Interim transcript</h3>
      <div class="interim p-3 border rounded min-h-[48px] bg-white text-gray-700">
        {{ interimTranscript || '—' }}
      </div>
    </div>

    <div class="actions flex gap-2">
      <button @click="clear" class="px-3 py-1 rounded bg-yellow-300">
        Clear
      </button>
      <button
        v-if="finalTranscript"
        @click="sendToBackend()"
        class="px-3 py-1 rounded bg-blue-600 text-white"
      >
        Send final to backend
      </button>
    </div>

    <div class="mt-6">
      <h4 class="font-semibold">Logs</h4>
      <pre class="mt-2 p-3 border rounded bg-black text-white text-sm max-h-40 overflow-auto">
{{ logText }}
      </pre>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Capacitor } from '@capacitor/core';
import { useWebSpeechStt } from '@/composables/useWebSpeechStt';
import { useNativeSpeechStt } from '@/composables/useNativeSpeechStt';
import { useUnifiedTTS } from '@/composables/useUnifiedTTS';

// --- TTS (unified) ---
const {
  speak: ttsSpeak,
  stop: ttsStop,
  modeLabel: ttsModeLabel,
  supported: ttsSupported
} = useUnifiedTTS();

const sayHello = () => {
  if (!ttsSupported()) {
    console.warn('No TTS support');
    return;
  }
  ttsSpeak('Maayong buntag?'), { lang: 'fil-PH', pitch: 1.1 };
};

// --- STT (web or native, decided at runtime) ---
const isNative = Capacitor.isNativePlatform();

const stt = isNative
  ? useNativeSpeechStt()
  : useWebSpeechStt();

const {
  supported: sttSupported,
  listening,
  interimTranscript,
  finalTranscript,
  logText,
  lang,
  start: sttStart,
  stop: sttStop,
  clear,
  sendToBackend
} = stt;

// autoRestart only exists on web STT composable
const hasAutoRestart = 'autoRestart' in stt;
const autoRestart = hasAutoRestart ? stt.autoRestart : null;

// Label just for STT mode
const sttModeLabel = computed(() =>
  isNative ? 'Native (Capacitor plugin)' : 'Web Speech API'
);
</script>

<style scoped>
.test1 {
  font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
