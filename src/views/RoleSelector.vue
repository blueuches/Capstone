<template>

  <div
    class="relative min-h-screen w-screen bg-cover bg-center bg-no-repeat flex flex-col"
    style="background-image: url('/111.png');"
  >

    <router-link to="/">
      <button
        class="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-md text-sm md:text-base transition-all"
      >
        Back
      </button>
    </router-link>

    <div class="p-6 text-center">
      <h2 class="text-3xl font-bold mb-6">Select Your Role</h2>
      <div class="flex flex-row gap-4 items-center">
        <router-link to="/senior/login">
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-md text-sm md:text-base transition-all">🧓 Senior Citizen</button>
        </router-link>
        <router-link to="/osca/dashboard">
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-md text-sm md:text-base transition-all">🏢 OSCA Personnel</button>
        </router-link>
        <router-link to="/barangay/dashboard">
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-md text-sm md:text-base transition-all">🏘️ Barangay Personnel</button>
        </router-link>
      </div>
    </div>
  </div>
</template>
