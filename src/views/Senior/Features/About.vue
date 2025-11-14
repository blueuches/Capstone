<!-- src/pages/About.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
    <!-- Header -->
    <header class="bg-emerald-600 text-white px-4 py-4 flex items-center shadow">
      <button @click="$router.back()" class="text-white text-2xl mr-3 leading-none">
        ←
      </button>
      <h1 class="text-xl font-semibold">About SeniorGo</h1>
    </header>

    <!-- Content -->
    <main class="p-4 space-y-5 pb-10">
      <!-- App Overview / Hero Card -->
      <section class="bg-white shadow-md rounded-2xl p-5 flex gap-4 items-start">
        <div class="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <img
            src="/icon.png"
            alt="SeniorGo logo"
            class="w-10 h-10 object-contain"
          />
        </div>
        <div class="flex-1">
          <h2 class="text-emerald-700 font-semibold text-lg">
            What is SeniorGo?
          </h2>
          <p class="text-gray-700 text-sm mt-2 leading-relaxed">
            SeniorGo is a friendly digital companion made especially for senior citizens.
            It helps you know what programs are available, apply for benefits,
            track your requests, and receive important updates from your
            barangay and OSCA — using simple screens and voice support.
          </p>
        </div>
      </section>

      <!-- Purpose / Mission & Vision -->
      <section class="bg-white shadow-md rounded-2xl p-5 space-y-4">
        <div>
          <h2 class="text-emerald-700 font-semibold text-lg">Our Purpose</h2>
          <p class="text-gray-700 text-sm mt-2 leading-relaxed">
            We want to make government services easier to reach, especially for seniors
            who may find it hard to travel or line up in offices. SeniorGo brings
            the help closer to you, so you can focus on living well with your
            family and community.
          </p>
        </div>

        <div class="border-t pt-4">
          <h2 class="text-emerald-700 font-semibold text-lg">Our Promise</h2>
          <ul class="text-gray-700 text-sm mt-2 space-y-1.5 list-disc list-inside">
            <li>Simple and clear steps for every application.</li>
            <li>Respectful and senior-friendly design.</li>
            <li>Working closely with barangays and OSCA offices.</li>
            <li>Keeping your personal information safe and private.</li>
          </ul>
        </div>
      </section>

      <!-- How SeniorGo Helps You -->
      <section class="bg-white shadow-md rounded-2xl p-5">
        <h2 class="text-emerald-700 font-semibold text-lg">How SeniorGo Helps</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-sm text-gray-700">
          <div class="flex gap-2 items-start">
            <span class="mt-0.5 text-emerald-600">✔</span>
            <p><span class="font-semibold">Guides you</span> through requirements for senior citizen programs.</p>
          </div>
          <div class="flex gap-2 items-start">
            <span class="mt-0.5 text-emerald-600">✔</span>
            <p><span class="font-semibold">Shows your status</span> so you know if your request is pending or approved.</p>
          </div>
          <div class="flex gap-2 items-start">
            <span class="mt-0.5 text-emerald-600">✔</span>
            <p><span class="font-semibold">Sends reminders</span> for important updates and schedules.</p>
          </div>
          <div class="flex gap-2 items-start">
            <span class="mt-0.5 text-emerald-600">✔</span>
            <p><span class="font-semibold">Uses voice support</span> so you don’t always have to type.</p>
          </div>
        </div>
      </section>

      <!-- Team & Partners -->
      <section class="bg-white shadow-md rounded-2xl p-5 space-y-3">
        <h2 class="text-emerald-700 font-semibold text-lg">Who Built SeniorGo?</h2>
        <p class="text-gray-700 text-sm leading-relaxed">
          SeniorGo is developed by a student project team in partnership with
          local community leaders. It is created with love and respect for the
          senior citizens of Butuan City and beyond.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <h3 class="text-emerald-700 font-semibold text-sm">Project Team</h3>
            <p class="text-gray-700 text-xs mt-1">
              SeniorGo Developers<br />
              (You may list your names or team here.)
            </p>
          </div>
          <div>
            <h3 class="text-emerald-700 font-semibold text-sm">Community Partners</h3>
            <p class="text-gray-700 text-xs mt-1">
              Barangay Offices<br />
              Office of the Senior Citizens Affairs (OSCA)
            </p>
          </div>
        </div>
      </section>

      <!-- App Info & Contact -->
      <section class="bg-white shadow-md rounded-2xl p-5 text-center space-y-3">
        <div>
          <h3 class="text-emerald-700 font-semibold text-sm">App Version</h3>
          <p class="text-gray-700 text-sm mt-1">v{{ appVersion }}</p>
        </div>

        <div class="pt-2 border-t">
          <h3 class="text-emerald-700 font-semibold text-sm">Need Help?</h3>
          <p class="text-gray-700 text-xs mt-1 leading-relaxed">
            For questions or suggestions about SeniorGo, please contact your
            barangay office or OSCA coordinator, or email us at:
          </p>
          <p class="text-emerald-700 text-xs font-semibold mt-1 break-words">
            {{ supportEmail }}
          </p>
        </div>

        <p class="text-[11px] text-gray-500 pt-2">
          By using SeniorGo, you agree that your information will be handled
          with care and only shared with authorized government partners to
          process your requests.
        </p>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      appVersion: '1.0.0',
      supportEmail: 'support@seniorgo.app'
    };
  }
};
</script>
