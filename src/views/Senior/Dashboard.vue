<!-- Dashboard.vue -->
<template>
  <div class="bg-gray-50 min-h-screen flex flex-col">
    <!-- Header -->
    <header
      class="w-full bg-white shadow-md fixed top-0 z-40 flex items-center justify-between px-6 py-3"
    >
      <div class="flex items-center gap-2">
        <div
          class="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold"
        >
          S
        </div>
        <h1 class="font-bold text-emerald-700 text-xl">SeniorGo Dashboard</h1>
      </div>
      <div class="flex items-center gap-4">
        <button class="text-gray-600 hover:text-emerald-600" @click="onProfile">Profile</button>
        <button
          class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          @click="onLogout"
        >
          Logout
        </button>
      </div>
    </header>

    <div class="flex flex-1 pt-16">
      <!-- Sidebar -->
      <aside class="hidden md:flex w-64 bg-white shadow-lg flex-col fixed top-16 bottom-0">
        <nav class="flex-1 p-4 space-y-2">
          <button
            class="w-full text-left px-4 py-3 rounded-lg hover:bg-emerald-50 font-medium"
            :class="{ 'menu-active': currentSection === 'programs' }"
            @click="currentSection = 'programs'"
          >
            Programs
          </button>
          <button
            class="w-full text-left px-4 py-3 rounded-lg hover:bg-emerald-50 font-medium"
            :class="{ 'menu-active': currentSection === 'messages' }"
            @click="currentSection = 'messages'"
          >
            Messages
          </button>
          <button
            class="w-full text-left px-4 py-3 rounded-lg hover:bg-emerald-50 font-medium"
            :class="{ 'menu-active': currentSection === 'application' }"
            @click="currentSection = 'application'"
          >
            Application
          </button>
          <button
            class="w-full text-left px-4 py-3 rounded-lg hover:bg-emerald-50 font-medium"
            :class="{ 'menu-active': currentSection === 'notifications' }"
            @click="currentSection = 'notifications'"
          >
            Notifications
          </button>
        </nav>
      </aside>

      <!-- Mobile Nav -->
      <div
        class="md:hidden fixed bottom-0 inset-x-0 bg-white border-t shadow flex justify-around p-2 z-50"
      >
        <button
          class="flex flex-col items-center text-sm"
          :class="{ 'menu-active rounded-lg px-2 py-1': currentSection === 'programs' }"
          @click="currentSection = 'programs'"
        >
          Programs
        </button>

        <button
          class="flex flex-col items-center text-sm"
          :class="{ 'menu-active rounded-lg px-2 py-1': currentSection === 'application' }"
          @click="currentSection = 'application'"
        >
          Application
        </button>
        <button
          class="flex flex-col items-center text-sm"
          :class="{ 'menu-active rounded-lg px-2 py-1': currentSection === 'notifications' }"
          @click="currentSection = 'notifications'"
        >
          Notifications
        </button>
      </div>

      <!-- Main Content -->
      <main class="flex-1 p-6 space-y-8 md:ml-64">
        <!-- Programs -->
        <section id="programs" class="space-y-6" v-show="currentSection === 'programs'">
          <h2 class="text-2xl font-bold text-emerald-700">Available Programs</h2>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div class="bg-white rounded-2xl shadow-md p-6 flex flex-col">
              <h3 class="font-semibold text-emerald-600 text-lg">Food Assistance</h3>
              <p class="text-gray-600 mt-2 flex-1">
                Apply for monthly food packs and nutrition aid provided by OSCA and your barangay.
              </p>

              <router-link to="/senior/form">
                <button
                  class="mt-4 w-full px-5 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
                >
                  Apply
                </button>
              </router-link>
            </div>
            <div class="bg-white rounded-2xl shadow-md p-6 flex flex-col">
              <h3 class="font-semibold text-emerald-600 text-lg">Medical Checkup</h3>
              <p class="text-gray-600 mt-2 flex-1">
                Register for free consultations and annual medical checkups arranged in your
                barangay.
              </p>
              <router-link to="/senior/form">
                <button
                  class="mt-4 w-full px-5 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
                >
                  Apply
                </button>
              </router-link>
            </div>
            <div class="bg-white rounded-2xl shadow-md p-6 flex flex-col">
              <h3 class="font-semibold text-emerald-600 text-lg">Livelihood Support</h3>
              <p class="text-gray-600 mt-2 flex-1">
                Join skills training and livelihood support activities to help seniors earn extra
                income.
              </p>
              <router-link to="/senior/form">
                <button
                  class="mt-4 w-full px-5 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
                >
                  Apply
                </button>
              </router-link>
            </div>
          </div>
        </section>

        <!-- Application -->
        <section id="application" class="space-y-6" v-show="currentSection === 'application'">
          <h2 class="text-2xl font-bold text-emerald-700">Submit Application</h2>
          <form
            class="bg-white rounded-2xl shadow-md p-6 space-y-4"
            @submit.prevent="submitApplication"
          >
            <div>
              <label class="block text-sm font-semibold text-gray-700">Upload Requirements</label>
              <input
                type="file"
                class="mt-2 block w-full text-sm text-gray-600 border rounded-lg px-3 py-2"
                @change="onFileChange"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700">Remarks</label>
              <textarea
                rows="3"
                placeholder="Any notes for barangay personnel..."
                class="mt-2 block w-full border rounded-lg px-3 py-2"
                v-model="remarks"
              ></textarea>
            </div>
            <button
              type="submit"
              class="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
            >
              Submit Application
            </button>
          </form>
        </section>

        <!-- Notifications -->
        <section id="notifications" class="space-y-6" v-show="currentSection === 'notifications'">
          <h2 class="text-2xl font-bold text-emerald-700">Notifications</h2>
          <div class="space-y-3">
            <div class="p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded-lg">
              Your Food Assistance application is
              <span class="font-bold text-yellow-700">Pending</span> at Barangay.
              <div class="text-sm text-gray-500">2 days ago</div>
            </div>
            <div class="p-4 border-l-4 border-green-500 bg-green-50 rounded-lg">
              Your Medical Checkup request has been
              <span class="font-bold text-green-700">Validated</span>.
              <div class="text-sm text-gray-500">5 days ago</div>
            </div>
            <div class="p-4 border-l-4 border-red-500 bg-red-50 rounded-lg">
              Your Livelihood application was <span class="font-bold text-red-700">Declined</span>.
              Please contact your barangay.
              <div class="text-sm text-gray-500">1 week ago</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { supabase } from '../../supabase/client'
import { useRouter } from 'vue-router'

const currentSection = ref('programs')

const chatInput = ref('')
const messages = ref([])
const chatBoxRef = ref(null)

const selectedFile = ref(null)
const remarks = ref('')

// events
async function sendMessage() {
  const t = chatInput.value.trim()
  if (!t) return
  messages.value.push({ text: t, sender: 'me' })
  chatInput.value = ''
  await nextTick()
  if (chatBoxRef.value) chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
}

function onFileChange(e) {
  selectedFile.value = e.target.files?.[0] ?? null
}

function submitApplication() {
  // plug in Supabase upload + DB insert here
  alert('Application submitted (demo).')
}

function onApply(program) {
  alert(`Apply: ${program}`)
}

function onProfile() {
  alert('Profile clicked')
}

//logout
const router = useRouter()

const onLogout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    alert('Logout failed: ' + error.message)
    return
  }
  // Clear any local storage/session if needed
  localStorage.clear()

  // Redirect to login page
  router.push('/')
}
</script>

<style scoped>
.menu-active {
  background-color: #10b981;
  color: white;
}
</style>
