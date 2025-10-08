<!-- SeniorGoApplicationForm.vue -->
<template>
  <div class="bg-gradient-to-b from-emerald-50 to-white min-h-screen flex flex-col items-center py-10">
    <main class="w-full max-w-4xl px-6">
      <!-- Header -->
      <header class="text-center mb-6">
        <router-link to="/senior/dashboard"
          class="absolute top-3 left-4 text-emerald-700 text-lg sm:text-xl font-semibold drop-shadow-md tracking-wide"
        >
          ← Dashboard
        </router-link>

        <h1 class="text-3xl md:text-4xl font-extrabold text-emerald-700">
          Senior Citizen Application Form
        </h1>
      </header>

      <!-- Stepper -->
      <section aria-label="Progress" class="bg-white rounded-xl shadow px-4 py-3 mb-6">
        <div class="flex items-center justify-between text-sm text-gray-700">
          <div class="flex items-center gap-3">
            <div
              v-for="i in totalSteps"
              :key="i"
              :id="`dot-${i}`"
              class="w-8 h-8 rounded-full font-bold grid place-items-center"
              :class="dotClass(i)"
            >
              {{ dotLabel(i) }}
            </div>
          </div>
          <div id="stepCounter">
            Step <span id="stepNow">{{ currentStep }}</span> of {{ totalSteps }}
          </div>
        </div>
      </section>

      <!-- Form -->
      <form id="multiStepForm" class="bg-white rounded-2xl shadow-md p-6 space-y-6" @submit.prevent="onSubmit">
        <!-- Step 1 -->
        <div v-show="currentStep === 1" class="fade-in" id="step-1">
          <h3 class="text-xl font-semibold text-emerald-600 mb-4">Step 1: Personal Information</h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="first_name" type="text" placeholder="First Name" class="border p-2 rounded" required />
            <input name="middle_name" type="text" placeholder="Middle Name" class="border p-2 rounded" />
            <input name="last_name" type="text" placeholder="Last Name" class="border p-2 rounded" required />
          </div>

          <div class="mt-4 flex gap-6">
            <label class="flex items-center gap-2">
              <input type="radio" name="gender" value="Male" required /> Male
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" name="gender" value="Female" /> Female
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input name="age" type="number" placeholder="Age" class="border p-2 rounded" required />
            <input name="citizenship" type="text" placeholder="Citizenship" class="border p-2 rounded" />
            <select name="civil_status" class="border p-2 rounded" required>
              <option value="">Civil Status</option>
              <option>Single</option>
              <option>Married</option>
              <option>Widowed</option>
              <option>Separated</option>
            </select>
            <input name="dob" type="text" placeholder="Date of Birth (mm/dd/yy)" class="border p-2 rounded" />
            <input name="pob" type="text" placeholder="Place of Birth" class="border p-2 rounded" />
          </div>

          <div class="flex justify-end mt-6">
            <button type="button" @click="nextStep" class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">
              Next
            </button>
          </div>
        </div>

        <!-- Step 2 -->
        <div v-show="currentStep === 2" class="fade-in" id="step-2">
          <h3 class="text-xl font-semibold text-emerald-600 mb-4">Step 2: Contact &amp; Health</h3>

          <input name="home_address" type="text" placeholder="Home Address" class="border p-2 rounded w-full mb-3" />
          <input name="barangay" type="text" placeholder="Barangay" class="border p-2 rounded w-full mb-3" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="landline" type="text" placeholder="Landline" class="border p-2 rounded" />
            <input name="mobile" type="text" placeholder="Mobile No" class="border p-2 rounded" />
          </div>

          <textarea
            name="education_occupation_skills"
            placeholder="Educational Attainment / Occupation / Skills"
            class="border p-2 rounded w-full mt-4"
          ></textarea>

          <div class="mt-4">
            <label class="block font-medium">PhilHealth Membership</label>
            <label class="block"><input type="radio" name="philhealth" value="Member" /> Member</label>
            <label class="block"><input type="radio" name="philhealth" value="Non-Member" /> Non-Member</label>
            <label class="block"><input type="radio" name="philhealth" value="Dependent" /> Dependent of PhilHealth Member</label>
          </div>

          <div class="flex justify-between mt-6">
            <button type="button" @click="prevStep" class="px-6 py-2 border rounded hover:bg-gray-100">Back</button>
            <button type="button" @click="nextStep" class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">
              Next
            </button>
          </div>
        </div>

        <!-- Step 3 -->
        <div v-show="currentStep === 3" class="fade-in" id="step-3">
          <h3 class="text-xl font-semibold text-emerald-600 mb-4">Step 3: Additional Information</h3>

          <label class="block font-medium mb-2">Living Arrangements</label>
          <div class="space-y-2 mb-4">
            <label class="flex items-start gap-2">
              <input type="radio" name="living_arrangement" value="Alone" />
              <span>Living Alone</span>
            </label>

            <label class="flex flex-col gap-1">
              <span class="flex items-start gap-2">
                <input type="radio" name="living_arrangement" value="With Relatives" />
                <span>Living with Relatives/Children</span>
              </span>
              <input name="relative_contact" type="text" placeholder="Name & Contact # of Relative/Children" class="border p-2 rounded w-full" />
            </label>

            <label class="flex flex-col gap-1">
              <span class="flex items-start gap-2">
                <input type="radio" name="living_arrangement" value="With Non-Relatives" />
                <span>Living with Non-Relatives</span>
              </span>
              <input name="nonrelative_contact" type="text" placeholder="Name & Contact # of Non-Relative" class="border p-2 rounded w-full" />
            </label>
          </div>

          <select name="health_condition" class="border p-2 rounded w-full mb-4">
            <option value="">Health Condition</option>
            <option>Healthy</option>
            <option>Sickly/Frail</option>
            <option>Bedridden/Disabled</option>
          </select>

          <input name="disability" type="text" placeholder="State Disability (if any)" class="border p-2 rounded w-full mb-4" />

          <label class="block font-medium mb-2">Pensioner</label>
          <div class="space-y-2 mb-4">
            <label class="flex items-center gap-2"><input type="radio" name="pensioner" value="Yes" /> Yes</label>
            <label class="flex items-center gap-2"><input type="radio" name="pensioner" value="No" /> No</label>

            <div class="pl-4 space-y-1 mt-2">
              <label class="flex items-center gap-2"><input type="checkbox" name="pension_type" value="SSS" /> SSS</label>
              <label class="flex items-center gap-2"><input type="checkbox" name="pension_type" value="GSIS" /> GSIS</label>
              <label class="flex items-center gap-2"><input type="checkbox" name="pension_type" value="PVAO" /> PVAO</label>
              <label class="flex items-center gap-2"><input type="checkbox" name="pension_type" value="Others" /> Others</label>
            </div>
          </div>

          <label class="block font-medium mb-2">Beneficiary</label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            <label class="flex items-center gap-2"><input type="checkbox" name="beneficiary_type" value="Pantawid" /> Pantawid</label>
            <label class="flex items-center gap-2"><input type="checkbox" name="beneficiary_type" value="Non-Pantawid" /> Non-Pantawid</label>
            <label class="flex items-center gap-2"><input type="checkbox" name="beneficiary_type" value="Social Pension Beneficiary" /> Social Pension</label>
            <label class="flex items-center gap-2"><input type="checkbox" name="beneficiary_type" value="SSS" /> SSS</label>
            <label class="flex items-center gap-2"><input type="checkbox" name="beneficiary_type" value="GSIS" /> GSIS</label>
            <label class="flex items-center gap-2"><input type="checkbox" name="beneficiary_type" value="Military" /> Military</label>
            <label class="flex items-center gap-2"><input type="checkbox" name="beneficiary_type" value="Others" /> Others</label>
          </div>

          <input name="osca_prev" type="text" placeholder="OSCA ID issued before? Where and When?" class="border p-2 rounded w-full mb-4" />
          <input name="em_name" type="text" placeholder="Emergency Contact Name" class="border p-2 rounded w-full mb-4" />
          <input name="em_address" type="text" placeholder="Emergency Address" class="border p-2 rounded w-full mb-4" />
          <input name="em_number" type="text" placeholder="Emergency Contact Number" class="border p-2 rounded w-full mb-4" />
          <input name="blood_type" type="text" placeholder="Blood Type" class="border p-2 rounded w-full mb-4" />

          <div class="flex justify-between mt-6">
            <button type="button" @click="prevStep" class="px-6 py-2 border rounded hover:bg-gray-100">Back</button>
            <button type="submit" class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">Submit</button>
          </div>
        </div>
      </form>
    </main>

    <!-- Global Mic Button Only -->
    <div class="fixed bottom-5 right-5">
      <button
        id="globalMic"
        type="button"
        class="rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white p-6"
        title="Tap to Speak"
        @click="$emit('mic')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z" />
          <path d="M19 11a1 1 0 1 0-2 0 5 5 0 1 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V20H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-2.08A7 7 0 0 0 19 11z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentStep = ref(1)
const totalSteps = 3

function nextStep() {
  if (currentStep.value < totalSteps) currentStep.value++
}
function prevStep() {
  if (currentStep.value > 1) currentStep.value--
}

function dotClass(i: number) {
  // completed & current share emerald bg; future steps are gray
  return i <= currentStep.value
    ? 'bg-emerald-600 text-white'
    : 'bg-gray-200 text-gray-600'
}
function dotLabel(i: number) {
  if (i < currentStep.value) return '✓'
  return String(i)
}

function onSubmit(e: Event) {
  const form = e.target as HTMLFormElement
  const fd = new FormData(form)
  const payload: Record<string, any> = {}
  for (const [k, v] of fd.entries()) {
    // handle multi-select checkboxes (same name)
    if (payload[k]) {
      if (Array.isArray(payload[k])) payload[k].push(v)
      else payload[k] = [payload[k], v]
    } else {
      payload[k] = v
    }
  }
  // Replace this with Supabase insert + TTS success cue as needed
  alert('Form captured. This would be sent to OSCA/Barangay.')
  console.log('Form payload:', payload)
}
</script>

<style scoped>
.step { display: none; }
.step.active { display: block; }

/* Your utilities recreated here */
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}

.fade-in { animation: fade 200ms ease-in; }
@keyframes fade { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: none } }
</style>