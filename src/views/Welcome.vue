<template>
  <div
    class="relative min-h-screen w-screen bg-cover bg-center bg-no-repeat flex flex-col"
    style="background-image: url('/111.png');"
  >
    <!-- Top-right Continue Button -->
    <router-link to="/roles">
      <button
        class="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-md text-sm md:text-base transition-all"
      >
        Continue Here
      </button>
    </router-link>

    <!-- Centered Text with Responsive Width -->
    <div class="flex-grow flex items-center justify-center">
      <div class="w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-48 text-center">
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-900 drop-shadow-lg">
          SeniorGo
        </h1>
        <p class="mt-4 text-lg sm:text-xl md:text-2xl text-blue-800 font-medium">
          Seniors in the know, benefits flow
        </p>
      </div>
    </div>
  </div>
</template>
