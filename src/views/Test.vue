<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">
          Sequential Voice Form
        </h1>
        <p class="text-gray-600">
          Automated TTS to STT to Field filling loop
        </p>
      </div>

      <div v-if="!isFormComplete && logs.length > 0" class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{{ currentFieldIndex + 1 }} of {{ formFields.length }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div 
            class="bg-emerald-500 h-3 rounded-full transition-all duration-500"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
        <p class="text-sm text-gray-600 mt-2">
          Current field: <strong>{{ currentField.label }}</strong>
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-800">Status</h2>
            <p :class="statusClass">{{ status }}</p>
          </div>
          
          <div class="flex gap-2">
            <select 
              v-model="lang" 
              class="px-3 py-2 border rounded-lg text-sm"
              :disabled="isListening || isSpeaking"
            >
              <option value="ceb-PH">Cebuano</option>
              <option value="fil-PH">Filipino</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            v-if="!isFormComplete && logs.length === 0"
            @click="startForm"
            :disabled="isSpeaking || isListening"
            class="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Start Form
          </button>

          <button
            v-if="isListening"
            @click="stopListening"
            class="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Stop and Submit Answer
          </button>

          <button
            v-if="isFormComplete"
            @click="startForm"
            class="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Start New Form
          </button>
        </div>

        <div v-if="isListening" class="space-y-2">
          <div class="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
            <p class="text-xs text-emerald-700 font-semibold mb-1">
              LISTENING... (Interim)
            </p>
            <p class="text-gray-800">
              {{ interimTranscript || 'Speak now...' }}
            </p>
          </div>
          <div v-if="transcript" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-xs text-blue-700 font-semibold mb-1">
              Final Transcript
            </p>
            <p class="text-gray-800">{{ transcript }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Form Data</h2>
        <div class="space-y-4">
          <div 
            v-for="(field, index) in formFields"
            :key="field.key"
            :class="getFieldClass(index)"
          >
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ field.label }}
              <span v-if="index === currentFieldIndex && !isFormComplete" class="ml-2 text-emerald-600 text-xs">
                Current
              </span>
            </label>
            <input
              :type="field.type"
              v-model="formData[field.key]"
              :placeholder="field.placeholder"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div v-if="isFormComplete" class="mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
          <p class="text-green-800 font-semibold text-center">
            Form Complete! All fields have been filled.
          </p>
        </div>
      </div>

      <div class="bg-gray-900 rounded-xl shadow-lg p-6">
        <h3 class="text-white font-semibold mb-3">Activity Logs</h3>
        <div class="bg-black rounded-lg p-4 h-64 overflow-y-auto">
          <p v-if="logs.length === 0" class="text-gray-500 text-sm">No activity yet...</p>
          <div v-else class="space-y-1">
            <p v-for="(log, i) in logs" :key="i" class="text-green-400 text-xs font-mono">
              {{ log }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const formData = ref({
  name: '',
  age: '',
  city: '',
  email: ''
});

const formFields = [
  {
    key: 'name',
    label: 'Name',
    question: 'Unsa imo ngalan?',
    placeholder: 'Your name',
    type: 'text'
  },
  {
    key: 'age',
    label: 'Age',
    question: 'Pila na ka tuig?',
    placeholder: 'Your age',
    type: 'number'
  },
  {
    key: 'city',
    label: 'City',
    question: 'Asa ka nagpuyo?',
    placeholder: 'Your city',
    type: 'text'
  },
  {
    key: 'email',
    label: 'Email',
    question: 'Unsa imo email address?',
    placeholder: 'Your email',
    type: 'email'
  }
];

const currentFieldIndex = ref(0);
const isListening = ref(false);
const isSpeaking = ref(false);
const transcript = ref('');
const interimTranscript = ref('');
const status = ref('Ready to start');
const logs = ref([]);
const isFormComplete = ref(false);
const lang = ref('ceb-PH');

let recognition = null;
const synth = window.speechSynthesis;

const currentField = computed(() => formFields[currentFieldIndex.value]);
const progress = computed(() => ((currentFieldIndex.value + 1) / formFields.length) * 100);

const statusClass = computed(() => {
  if (isListening.value) return 'text-sm mt-1 text-emerald-600 font-semibold';
  if (isSpeaking.value) return 'text-sm mt-1 text-blue-600 font-semibold';
  return 'text-sm mt-1 text-gray-600';
});

const getFieldClass = (index) => {
  const base = 'p-4 rounded-lg border-2 transition-all';
  if (index === currentFieldIndex.value && !isFormComplete.value) {
    return `${base} border-emerald-500 bg-emerald-50`;
  }
  if (formData.value[formFields[index].key]) {
    return `${base} border-green-300 bg-green-50`;
  }
  return `${base} border-gray-200 bg-gray-50`;
};

const addLog = (message) => {
  const timestamp = new Date().toLocaleTimeString();
  logs.value.push(`[${timestamp}] ${message}`);
};

const initRecognition = () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang.value;

    recognition.onstart = () => {
      isListening.value = true;
      addLog('Microphone started');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptText = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcriptText;
        } else {
          interim += transcriptText;
        }
      }

      interimTranscript.value = interim;
      if (final) {
        transcript.value = final;
        addLog(`Transcript: ${final}`);
      }
    };

    recognition.onerror = (event) => {
      addLog(`Error: ${event.error}`);
      isListening.value = false;
    };

    recognition.onend = () => {
      isListening.value = false;
      addLog('Microphone stopped');
    };
  }
};

const speak = (text) => {
  return new Promise((resolve) => {
    if (!synth) {
      resolve();
      return;
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang.value;
    utterance.pitch = 1.1;
    utterance.rate = 0.9;

    utterance.onstart = () => {
      isSpeaking.value = true;
      addLog(`Speaking: ${text}`);
    };

    utterance.onend = () => {
      isSpeaking.value = false;
      addLog('Speech ended');
      resolve();
    };

    utterance.onerror = () => {
      isSpeaking.value = false;
      addLog('Speech error');
      resolve();
    };

    synth.speak(utterance);
  });
};

const startListening = () => {
  if (recognition && !isListening.value) {
    transcript.value = '';
    interimTranscript.value = '';
    recognition.start();
  }
};

const stopListening = async () => {
  if (recognition && isListening.value) {
    recognition.stop();
    
    await new Promise(resolve => setTimeout(resolve, 500));

    if (transcript.value) {
      await processAnswer(transcript.value);
    }
  }
};

const processAnswer = async (answer) => {
  const field = currentField.value;
  
  addLog(`Processing answer for ${field.label}: ${answer}`);
  status.value = `Processing answer for ${field.label}...`;

  const cleanedAnswer = answer.trim();
  
  if (cleanedAnswer) {
    formData.value[field.key] = cleanedAnswer;
    addLog(`Filled ${field.label} with: ${cleanedAnswer}`);

    await speak(`Tama ba ni, ${cleanedAnswer}?`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (currentFieldIndex.value < formFields.length - 1) {
      currentFieldIndex.value++;
      transcript.value = '';
      interimTranscript.value = '';
    } else {
      isFormComplete.value = true;
      status.value = 'Form completed!';
      await speak('Salamat! Kompleto na ang imong mga tubag.');
      addLog('Form completed');
    }
  } else {
    addLog('No answer received');
    status.value = 'No answer received. Please try again.';
  }
};

const startForm = async () => {
  currentFieldIndex.value = 0;
  isFormComplete.value = false;
  formData.value = { name: '', age: '', city: '', email: '' };
  logs.value = [];
  addLog('Starting form process');
  status.value = 'Starting...';
  
  await new Promise(resolve => setTimeout(resolve, 500));
  await askCurrentQuestion();
};

const askCurrentQuestion = async () => {
  const field = currentField.value;
  status.value = `Asking: ${field.label}`;
  
  await speak(field.question);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  startListening();
  status.value = `Listening for: ${field.label}`;
};

watch(currentFieldIndex, () => {
  if (currentFieldIndex.value >= 0 && currentFieldIndex.value < formFields.length && !isFormComplete.value) {
    if (logs.value.length > 0) {
      askCurrentQuestion();
    }
  }
});

watch(lang, (newLang) => {
  if (recognition) {
    recognition.lang = newLang;
  }
});

onMounted(() => {
  initRecognition();
});

onUnmounted(() => {
  if (recognition) {
    recognition.stop();
  }
  if (synth) {
    synth.cancel();
  }
});
</script>

<style scoped>
.min-h-screen {
  font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}
</style>