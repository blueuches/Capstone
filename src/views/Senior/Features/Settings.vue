<!-- src/pages/Settings.vue -->
<template>
  <div class="senior-font-root min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
    <!-- Header -->
    <header class="bg-emerald-600 text-white px-4 py-4 flex items-center shadow">
      <button @click="$router.back()" class="text-white text-2xl mr-3 leading-none">
        ←
      </button>
      <h1 class="text-xl font-semibold">Settings</h1>
    </header>

    <!-- Content -->
    <main class="p-4 space-y-5 pb-8">
      <!-- User Info -->
      <section class="bg-white shadow-md rounded-2xl p-4 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
          {{ initials }}
        </div>
        <div class="flex-1">
          <h2 class="font-semibold text-emerald-700 text-base">
            {{ displayName || 'Senior User' }}
          </h2>
          <p class="text-xs text-gray-500">
            {{ roleLabel }}
          </p>
        </div>
        <button
          class="px-3 py-1.5 text-xs font-semibold border border-emerald-500 text-emerald-700 rounded-full hover:bg-emerald-50"
        >
          Edit Profile
        </button>
      </section>

      <!-- App Preferences -->
      <section class="bg-white shadow-md rounded-2xl p-4 space-y-3">
        <h3 class="font-semibold text-emerald-700 text-base">App Preferences</h3>
        <p class="text-xs text-gray-500">Adjust how SeniorGo looks and feels.</p>

        <!-- Dark Mode -->
        <div class="flex items-center justify-between pt-2">
          <div>
            <p class="text-sm font-medium text-gray-800">Dark Mode</p>
            <p class="text-xs text-gray-500">Dim colors for low-light use.</p>
          </div>
          <button
            @click="darkMode = !darkMode"
            :class="[
              'w-12 h-7 rounded-full flex items-center px-1 transition',
              darkMode ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
            ]"
          >
            <span class="w-5 h-5 rounded-full bg-white shadow"></span>
          </button>
        </div>

        <!-- Large Text -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-800">Larger Text</p>
            <p class="text-xs text-gray-500">Make labels and buttons easier to read.</p>
          </div>
          <button
            @click="largeText = !largeText"
            :class="[
              'w-12 h-7 rounded-full flex items-center px-1 transition',
              largeText ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
            ]"
          >
            <span class="w-5 h-5 rounded-full bg-white shadow"></span>
          </button>
        </div>

        <!-- App Language -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-800">Language</p>
            <p class="text-xs text-gray-500">Choose your preferred language.</p>
          </div>
          <select
            v-model="language"
            class="text-xs border border-gray-300 rounded-full px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="en">English</option>
            <option value="fil">Filipino</option>
            <option value="bisaya">Bisaya</option>
          </select>
        </div>
      </section>

      <!-- Voice & Accessibility -->
      <section class="bg-white shadow-md rounded-2xl p-4 space-y-3">
        <h3 class="font-semibold text-emerald-700 text-base">Voice & Accessibility</h3>
        <p class="text-xs text-gray-500">Make SeniorGo easier and more comfortable to use.</p>

        <div class="flex items-center justify-between pt-2">
          <div>
            <p class="text-sm font-medium text-gray-800">Voice Hints</p>
            <p class="text-xs text-gray-500">Hear short instructions while using the app.</p>
          </div>
          <button
            @click="voiceHints = !voiceHints"
            :class="[
              'w-12 h-7 rounded-full flex items-center px-1 transition',
              voiceHints ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
            ]"
          >
            <span class="w-5 h-5 rounded-full bg-white shadow"></span>
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-800">Confirm with Voice</p>
            <p class="text-xs text-gray-500">App repeats choices before you submit.</p>
          </div>
          <button
            @click="voiceConfirm = !voiceConfirm"
            :class="[
              'w-12 h-7 rounded-full flex items-center px-1 transition',
              voiceConfirm ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
            ]"
          >
            <span class="w-5 h-5 rounded-full bg-white shadow"></span>
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-800">Vibration Feedback</p>
            <p class="text-xs text-gray-500">Phone vibrates when an action is done.</p>
          </div>
          <button
            @click="vibrate = !vibrate"
            :class="[
              'w-12 h-7 rounded-full flex items-center px-1 transition',
              vibrate ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
            ]"
          >
            <span class="w-5 h-5 rounded-full bg-white shadow"></span>
          </button>
        </div>
      </section>

      <!-- Notifications -->
      <section class="bg-white shadow-md rounded-2xl p-4 space-y-3">
        <h3 class="font-semibold text-emerald-700 text-base">Notifications</h3>
        <p class="text-xs text-gray-500">Choose how SeniorGo contacts you.</p>

        <div class="flex items-center justify-between pt-2">
          <p class="text-sm text-gray-800 font-medium">App notifications</p>
          <button
            @click="pushNotifs = !pushNotifs"
            :class="[
              'w-12 h-7 rounded-full flex items-center px-1 transition',
              pushNotifs ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
            ]"
          >
            <span class="w-5 h-5 rounded-full bg-white shadow"></span>
          </button>
        </div>

        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-800 font-medium">SMS updates</p>
          <button
            @click="smsNotifs = !smsNotifs"
            :class="[
              'w-12 h-7 rounded-full flex items-center px-1 transition',
              smsNotifs ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
            ]"
          >
            <span class="w-5 h-5 rounded-full bg-white shadow"></span>
          </button>
        </div>

        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-800 font-medium">Email reminders</p>
          <button
            @click="emailNotifs = !emailNotifs"
            :class="[
              'w-12 h-7 rounded-full flex items-center px-1 transition',
              emailNotifs ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
            ]"
          >
            <span class="w-5 h-5 rounded-full bg-white shadow"></span>
          </button>
        </div>
      </section>

      <!-- Help & Info -->
      <section class="bg-white shadow-md rounded-2xl divide-y">
        <button class="w-full text-left px-4 py-3 hover:bg-emerald-50 text-sm font-medium text-gray-800">
          Help Center
        </button>
        <button class="w-full text-left px-4 py-3 hover:bg-emerald-50 text-sm font-medium text-gray-800">
          Contact Support
        </button>
        <button class="w-full text-left px-4 py-3 hover:bg-emerald-50 text-sm font-medium text-gray-800">
          Privacy Policy
        </button>
        <button class="w-full text-left px-4 py-3 hover:bg-emerald-50 text-sm font-medium text-gray-800">
          Terms of Use
        </button>
        <button class="w-full text-left px-4 py-3 hover:bg-emerald-50 text-xs text-gray-500">
          About SeniorGo (version {{ appVersion }})
        </button>
      </section>

      <!-- Danger Zone -->
      <section class="space-y-3">
        <button
          class="w-full bg-red-500 text-white py-3 rounded-2xl font-semibold shadow-md hover:bg-red-600"
        >
          Logout
        </button>
        <button
          class="w-full border border-red-400 text-red-600 py-3 rounded-2xl text-sm font-medium hover:bg-red-50"
        >
          Delete Account
        </button>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      // mock data – wire these up to your real user store later
      displayName: 'Lola Cita',
      roleLabel: 'Senior Citizen • Barangay Ampayon',
      darkMode: false,
      largeText: true,
      language: 'en',
      voiceHints: true,
      voiceConfirm: false,
      vibrate: true,
      pushNotifs: true,
      smsNotifs: false,
      emailNotifs: false,
      appVersion: '1.0.0'
    };
  },
  computed: {
    initials() {
      if (!this.displayName) return 'SG';
      return this.displayName
        .split(' ')
        .map(p => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }
  }
};
</script>
