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
            src="/logo1.png"
            alt="SeniorGo logo"
            class="h-10 w-auto md:h-12 object-contain flex-shrink-0"
          />
          <h1 class="text-base md:text-lg font-bold text-[#42ad43] ">
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
          <!-- if logged in -->
          <button
            v-if="isLoggedIn"
            @click="goToDashboard"
            class="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold shadow hover:bg-emerald-700 transition"
          >
            Go to Dashboard
          </button>

          <!-- if NOT logged in -->
          <template v-else>
            <router-link to="/login" class="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold shadow hover:bg-emerald-700 transition">Log In</router-link>
            <router-link to="/signup" class="px-4 py-2 border border-emerald-600 text-emerald-700 rounded-xl font-semibold shadow hover:bg-emerald-50 transition">Sign Up</router-link>
          </template>
        </div>


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
          <button
            v-if="isLoggedIn"
            @click="goToDashboard(); closeMenu()"
            class="flex-1 text-center px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold shadow hover:bg-emerald-700 transition"
          >
            Go to Dashboard
          </button>

          <template v-else>
            <router-link to="/login" class="flex-1 text-center px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold shadow hover:bg-emerald-700 transition">Log In</router-link>
            <router-link to="/signup" class="flex-1 text-center px-4 py-2 border border-emerald-600 text-emerald-700 rounded-xl font-semibold shadow hover:bg-emerald-50 transition">Sign Up</router-link>
          </template>
        </div>

      </div>
    </header>

    <!-- Decorative Blobs -->
    <div class="blob top-0 left-0"></div>
    <div class="blob bottom-0 right-0"></div>

    <!-- Hero -->
    <section class="relative min-h-[92vh] flex flex-col items-center justify-center px-6 sm:px-10 pt-28 pb-16">
        <div class="md:w-1/2 space-y-6 text-center z-10">
            <h2 class="text-4xl md:text-6xl font-extrabold text-[#42ad43] leading-tight drop-shadow">
                Welcome to <span class="text-[#42ad43]">SeniorGo</span>
            </h2>
            <p class="text-lg md:text-xl text-gray-700 max-w-xl mx-auto">
                A digital companion for Butuan’s beloved seniors.
            </p>
            <div class="flex justify-center gap-4 flex-wrap pt-2">
              <button
                v-if="isLoggedIn"
                @click="goToDashboard"
                class="px-6 py-3 bg-[#42ad43] text-white text-lg rounded-xl font-semibold shadow hover:bg-green-500 transition"
              >
                Go to Dashboard
              </button>

              <template v-else>
                <router-link to="/login" class="px-6 py-3 bg-[#42ad43] text-white text-lg rounded-xl font-semibold shadow hover:bg-green-500 transition">Log In</router-link>
                <router-link to="/signup" class="px-6 py-3 border border-[#42ad43] text-[#42ad43] text-lg rounded-xl font-semibold shadow hover:bg-emerald-100 transition">Sign Up</router-link>
              </template>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[#42ad43]  text-white text-center text-sm py-6">
      &copy; 2026 SeniorGo · Made for Butuan Seniors 
    </footer>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase/client' 

const router = useRouter()

const menuOpen = ref(false)
const isScrolled = ref(false)
const fontScale = ref(1) // simple accessibility control

const closeMenu = () => { menuOpen.value = false }

const session = ref(null)
const userRole = ref(null)
const isLoggedIn = computed(() => !!session.value?.user)

// scroll state for subtle border
const onScroll = () => { isScrolled.value = window.scrollY > 4 }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// dynamic font scale (features + testimonials blocks)
const scaledFontStyle = computed(() => ({
  fontSize: `${fontScale.value}rem`
}))

async function loadSessionAndRole() {
  const { data } = await supabase.auth.getSession()
  session.value = data.session

  if (!data.session?.user) {
    userRole.value = null
    return
  }

  // ✅ get role from profiles
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.session.user.id)
    .single()

  if (error) {
    console.error('Failed to load role:', error)
    userRole.value = null
    return
  }

  userRole.value = profile?.role ?? null
}

function roleToDashboardPath(role) {
  // ✅ Adjust these to match YOUR real routes
  switch (role) {
    case 'senior': return '/senior/dashboard'
    case 'barangay_staff': return '/barangay/dashboard'
    case 'osca_staff': return '/osca/dashboard'
    case 'admin': return '/admin/dashboard'
    default: return '/login' // fallback if role missing
  }
}

async function goToDashboard() {
  // Ensure role is loaded (in case user opened welcome page directly)
  if (isLoggedIn.value && !userRole.value) {
    await loadSessionAndRole()
  }
  router.push(roleToDashboardPath(userRole.value))
}

let authUnsub = null
onMounted(async () => {
  await loadSessionAndRole()

  const { data } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
    session.value = newSession
    if (!newSession?.user) {
      userRole.value = null
      return
    }
    await loadSessionAndRole()
  })
  authUnsub = data?.subscription
})

onBeforeUnmount(() => {
  authUnsub?.unsubscribe?.()
})
</script>

<style>
/* Smooth scroll app-wide */
html { scroll-behavior: smooth; }

/* Background gradient */
.gradient-bg {
  background: linear-gradient(
    to bottom right,
    #e9f7ec,
    #f3fbf5,
    #ffffff
  );
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
