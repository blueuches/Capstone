<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Voice Form Submission</h1>
    <div>
      <button class="bg-blue-600 text-white p-3 m-2 rounded-xl text-xl">🔊 Start Voice</button>
      <button class="bg-red-600 text-white p-3 m-2 rounded-xl text-xl">❌ Stop Voice</button>
    </div>
    <form class="mt-4 space-y-4">
      <input type="text" placeholder="Full Name" class="w-full p-4 border rounded-xl text-lg" />
      <input type="text" placeholder="Address" class="w-full p-4 border rounded-xl text-lg" />
      <button type="submit" class="bg-blue-600 text-white rounded-xl p-4 text-xl">Submit</button>
      <button type="button" class="bg-red-600 text-white rounded-xl p-4 text-xl">❌ Cancel</button>
    </form>
  </div>
</template>

<script setup>
// Placeholder: Integrate with STT → RASA → TTS logic later
</script>