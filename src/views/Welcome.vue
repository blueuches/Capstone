<template>
  <div class="text-gray-800 gradient-bg overflow-x-hidden" id="top">
    <!-- Navbar -->
<header
  class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur shadow-md"
  :class="{'border-b': isScrolled}"
>
  <div class="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 py-2">
    <!-- Logo: big icon on the far left -->
    <div class="flex items-center gap-2">
      <img
        src="/icon.png"
        alt="SeniorGo logo"
        class="h-10 w-auto md:h-12 object-contain flex-shrink-0"
      />
      <h1 class="text-base md:text-lg font-bold text-emerald-600">
        SeniorGo
      </h1>
    </div>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#features" class="hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded">Features</a>
          <a href="#testimonials" class="hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded">Testimonials</a>
          <a href="#top" class="hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded">Back to Top</a>
        </nav>

        <!-- Auth actions (desktop) -->
        <div class="hidden md:flex items-center gap-3">
          <router-link to="/login" class="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold shadow hover:bg-emerald-700 transition">Log In</router-link>
          <router-link to="/signup" class="px-4 py-2 border border-emerald-600 text-emerald-700 rounded-xl font-semibold shadow hover:bg-emerald-50 transition">Sign Up</router-link>
        </div>

        <!-- Mobile menu button -->
        <button
          class="md:hidden inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          @click="menuOpen = !menuOpen"
          :aria-expanded="menuOpen.toString()"
          aria-label="Toggle navigation"
        >
          <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Nav Panel -->
      <div
        class="md:hidden px-4 sm:px-6 pb-4 space-y-3"
        v-show="menuOpen"
      >
        <a href="#features" @click="closeMenu" class="block py-2 rounded hover:bg-emerald-50">Features</a>
        <a href="#testimonials" @click="closeMenu" class="block py-2 rounded hover:bg-emerald-50">Testimonials</a>
        <a href="#top" @click="closeMenu" class="block py-2 rounded hover:bg-emerald-50">Back to Top</a>
        <div class="pt-2 flex gap-3">
          <router-link to="/login" class="flex-1 text-center px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold shadow hover:bg-emerald-700 transition">Log In</router-link>
          <router-link to="/signup" class="flex-1 text-center px-4 py-2 border border-emerald-600 text-emerald-700 rounded-xl font-semibold shadow hover:bg-emerald-50 transition">Sign Up</router-link>
        </div>
      </div>
    </header>

    <!-- Decorative Blobs -->
    <div class="blob top-0 left-0"></div>
    <div class="blob bottom-0 right-0"></div>

    <!-- Hero -->
<section class="relative min-h-[92vh] flex flex-col items-center justify-center px-6 sm:px-10 pt-28 pb-16">
    <div class="md:w-1/2 space-y-6 text-center z-10">
        <h2 class="text-4xl md:text-6xl font-extrabold text-emerald-700 leading-tight drop-shadow">
            Welcome to <span class="text-emerald-600">SeniorGo</span>
        </h2>
        <p class="text-lg md:text-xl text-gray-700 max-w-xl mx-auto">
            A digital companion for Butuan’s beloved seniors. Access support programs with just your voice and a smile.
        </p>
        <div class="flex justify-center gap-4 flex-wrap pt-2">
            <router-link to="/login" class="px-6 py-3 bg-emerald-600 text-white text-lg rounded-xl font-semibold shadow hover:bg-emerald-700 transition">Log In</router-link>
            <router-link to="/signup" class="px-6 py-3 border border-emerald-600 text-emerald-700 text-lg rounded-xl font-semibold shadow hover:bg-emerald-100 transition">Sign Up</router-link>
        </div>
    </div>
</section>

    <!-- Features -->
    <!-- <section id="features" class="px-6 sm:px-10 py-20 bg-white relative" :style="scaledFontStyle">
      <h3 class="text-3xl font-bold text-emerald-700 text-center mb-12">Why Seniors Love SeniorGo</h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 max-w-6xl mx-auto">
        <div
          v-for="card in features"
          :key="card.title"
          class="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl shadow-xl text-center hover:scale-[1.02] transition-all duration-300"
        >
          <img :src="card.icon" :alt="card.alt" class="w-20 h-20 mx-auto mb-4" :class="card.anim"/>
          <h4 class="font-semibold text-lg text-emerald-700">{{ card.title }}</h4>
          <p class="text-sm text-gray-700 mt-2">{{ card.text }}</p>
        </div>
      </div>
    </section> -->

    <!-- Testimonials -->
    <section id="testimonials" class="px-6 sm:px-10 py-20 bg-emerald-50 relative" :style="scaledFontStyle">
      <h3 class="text-3xl font-bold text-emerald-700 text-center mb-12">What Seniors Are Saying</h3>

      <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 lg:gap-10">
        <figure class="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-2xl transition">
          <blockquote class="text-gray-700 italic text-lg">"I never thought I could apply for benefits on my own, but SeniorGo made it easy with just my voice."</blockquote>
          <figcaption class="mt-4 font-semibold text-emerald-700">Lola Cita, Brgy. Ampayon</figcaption>
        </figure>

        <figure class="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-2xl transition">
          <blockquote class="text-gray-700 italic text-lg">"Thanks to SeniorGo, I received my food support without needing to visit the barangay office."</blockquote>
          <figcaption class="mt-4 font-semibold text-emerald-700">Tatay Juan, Brgy. Libertad</figcaption>
        </figure>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-emerald-700 text-white text-center text-sm py-6">
      &copy; 2025 SeniorGo · Made for Butuan Seniors | Powered by Barangay &amp; OSCA
    </footer>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'

const menuOpen = ref(false)
const isScrolled = ref(false)
const fontScale = ref(1) // simple accessibility control

const closeMenu = () => { menuOpen.value = false }

// scroll state for subtle border
const onScroll = () => { isScrolled.value = window.scrollY > 4 }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// dynamic font scale (features + testimonials blocks)
const scaledFontStyle = computed(() => ({
  fontSize: `${fontScale.value}rem`
}))

const features = [
  {
    title: 'Voice Assistance',
    text: 'Talk to your device to apply for benefits — no typing needed.',
    icon: 'https://cdn-icons-png.flaticon.com/512/3063/3063829.png',
    alt: 'Voice feature icon',
    anim: 'animate-bounce motion-safe:animate-bounce motion-reduce:animate-none'
  },
  {
    title: 'Face Verification',
    text: 'Your face is your ID. Safe, secure, and fast application process.',
    icon: 'https://cdn-icons-png.flaticon.com/512/4392/4392832.png',
    alt: 'Face ID icon',
    anim: 'animate-pulse motion-safe:animate-pulse motion-reduce:animate-none'
  },
  {
    title: 'Simple Interface',
    text: 'Large buttons, big text, and no clutter — made just for you.',
    icon: 'https://cdn-icons-png.flaticon.com/512/2202/2202112.png',
    alt: 'Accessible design icon',
    anim: 'animate-wiggle motion-safe:animate-wiggle motion-reduce:animate-none'
  }
]
</script>

<style>
/* Smooth scroll app-wide */
html { scroll-behavior: smooth; }

/* Background gradient */
.gradient-bg {
  background: linear-gradient(to bottom right, #d1fae5, #f0fdf4);
}

/* Decorative blobs */
.blob {
  position: fixed;
  width: 28rem;
  height: 28rem;
  background: #a7f3d0;
  opacity: 0.22;
  filter: blur(100px);
  z-index: -1;
  border-radius: 50%;
}
.blob.top-0.left-0 { top: -6rem; left: -6rem; }
.blob.bottom-0.right-0 { bottom: -6rem; right: -6rem; }

/* Custom wiggle animation (Tailwind doesn’t include this by default) */
@keyframes wiggle {
  0%, 100% { transform: rotate(-2deg) translateY(0); }
  50% { transform: rotate(2deg) translateY(-2px); }
}
.animate-wiggle { animation: wiggle 1.2s ease-in-out infinite; }

/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .animate-bounce, .animate-pulse, .animate-wiggle {
    animation: none !important;
  }
}
</style>
