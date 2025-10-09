<template>
  <div class="relative flex items-center justify-center w-screen h-screen bg-gradient-to-b from-emerald-100 via-emerald-50 to-white overflow-hidden">
    <div class="absolute top-4 left-0 right-0 flex items-center justify-between px-6 z-50">
      <!-- Back button -->
      <router-link
        to="/senior/dashboard"
        class="flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-900 transition"
      >
        <!-- Back icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.75 19.5a.75.75 0 0 1-.53-.22L8.97 13.03a.75.75 0 0 1 0-1.06l6.25-6.25a.75.75 0 1 1 1.06 1.06L10.56 12l5.72 5.72a.75.75 0 0 1-.53 1.28z" />
        </svg>
        <span class="text-base">Back</span>
      </router-link>

      <!-- Save as Draft button -->
      <button
        @click="saveAsDraft"
        class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17 3H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 12H4V5h12v10z" />
          <path d="M9 7h2v2H9z" />
        </svg>
        Save as Draft
      </button>
    </div>

    <main class="relative w-[92%] max-w-md h-[90vh] bg-white shadow-2xl rounded-3xl border border-emerald-200 flex flex-col overflow-hidden">
      <!-- HEADER -->
      <header class="flex flex-col items-center justify-center py-4 border-b border-emerald-100 bg-white/90 backdrop-blur z-10 relative">

        <h1 class="text-xl font-extrabold text-emerald-700 text-center leading-tight">
          Senior ID Application Form
        </h1>

        <!-- PROGRESS BAR -->
        <div class="w-[85%] mt-4">
          <div class="flex justify-between text-xs font-medium text-gray-600 mb-1">
            <span>Step {{ currentStep }} of {{ totalSteps }}</span>
            <span>{{ stepLabel }}</span>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-2 bg-emerald-600 rounded-full transition-all duration-500"
              :style="{ width: progressWidth }"
            ></div>
          </div>
        </div>
      </header>

      <!-- CONTENT (scrolls internally) -->
      <section class="flex-1 overflow-y-auto px-5 py-4 custom-scroll">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- STEP 1 -->
          <div v-show="currentStep === 1" class="animate-fade-in space-y-4">

            <!-- 1. Name -->
            <div>
              <label class="block font-semibold mb-1">Name of Senior Citizen</label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input v-model="form.firstName" placeholder="First Name" class="form-input" required />
                <input v-model="form.middleName" placeholder="Middle Name" class="form-input" />
                <input v-model="form.lastName" placeholder="Last Name" class="form-input" required />
              </div>
            </div>

            <!-- 2. Gender -->
            <div>
              <label class="block font-semibold mb-1 text-gray-800">Gender</label>
              <div class="flex gap-6">
                <label class="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    v-model="form.gender"
                    value="Male"
                    class="appearance-none w-4 h-4 border-2 border-gray-400 rounded-full checked:border-emerald-600 checked:bg-emerald-600 transition-all"
                  />
                  <span class="text-gray-700 group-hover:text-emerald-700 transition">Male</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    v-model="form.gender"
                    value="Female"
                    class="appearance-none w-4 h-4 border-2 border-gray-400 rounded-full checked:border-emerald-600 checked:bg-emerald-600 transition-all"
                  />
                  <span class="text-gray-700 group-hover:text-emerald-700 transition">Female</span>
                </label>
              </div>
            </div>

            <!-- 3-5 -->
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold mb-1">Age</label>
                <input
                  v-model="form.age"
                  readonly
                  placeholder=""
                  class="form-input bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label class="block font-semibold mb-1">Citizenship</label>
                <input v-model="form.citizenship" class="form-input" />
              </div>
            </div>

            <div>
              <label class="block font-semibold mb-1">Civil Status</label>
              <select v-model="form.civilStatus" class="form-input">
                <option>Single</option>
                <option selected>Married</option>
                <option>Widowed</option>
                <option>Separated</option>
              </select>
            </div>

            <!-- 6. Birth -->
            <div>
              <label class="block font-semibold mb-1">Date of Birth</label>

              <DatePicker
                v-model="form.dob"
                :enable-time-picker="false"
                :max-date="new Date()"
                placeholder="Select Date of Birth"
                auto-apply
                :year-range="[1900, new Date().getFullYear()]"
                class="custom-datepicker w-full"
                @update:model-value="calculateAge"
              />

              <label class="block font-semibold mb-1">Place of Birth</label>
              <input
                v-model="form.pob"
                placeholder="Address"
                class="form-input mt-2"
              />
            </div>

          </div>

          <!-- STEP 2 -->
          <div v-show="currentStep === 2" class="animate-fade-in space-y-4">

            <div>
              <label class="block font-semibold mb-1">Applicant’s Home</label>
              <input v-model="form.address" placeholder="Street Name/Purok" class="form-input" />
              <input v-model="form.barangay" placeholder="Barangay" class="form-input mt-2" />
            </div>

            <div>
              <label class="block font-semibold mb-1">Contact Details</label>
              <input v-model="form.landline" placeholder="Landline" class="form-input" />
              <input v-model="form.mobile" placeholder="Mobile No" class="form-input mt-2" />
            </div>

            <div>
              <label class="block font-semibold mb-1">Educational Attainment / Occupation / Skills</label>
              <textarea v-model="form.education" class="form-input h-12"></textarea>
            </div>

            <div>
              <label class="block font-semibold mb-1">PhilHealth Membership</label>
              <div class="space-y-1">
                <label><input type="radio" v-model="form.philhealth" value="Member" /> Member</label><br />
                <label><input type="radio" v-model="form.philhealth" value="Non-Member" /> Non-Member</label><br />
                <label><input type="radio" v-model="form.philhealth" value="Dependent" /> Dependent of PhilHealth Member</label>
              </div>
            </div>
          </div>

          <!-- STEP 3 -->
          <div v-show="currentStep === 3" class="animate-fade-in space-y-4">

            <!-- 11-12 -->
            <div>
              <label class="block font-semibold mb-1">Living Arrangements</label>

              <div class="space-y-3">
                <!-- Option 1 -->
                <label class="flex items-center gap-2">
                  <input
                    type="radio"
                    v-model="form.living"
                    value="Alone"
                    class="accent-emerald-600"
                  />
                  <span>Living Alone</span>
                </label>

                <!-- Option 2 -->
                <div>
                  <label class="flex items-center gap-2">
                    <input
                      type="radio"
                      v-model="form.living"
                      value="With Relatives"
                      class="accent-emerald-600"
                    />
                    <span>Living with Relatives/Children</span>
                  </label>

                  <!-- Only show when selected -->
                  <transition name="fade">
                    <div v-if="form.living === 'With Relatives'" class="mt-2 space-y-2 pl-6">
                      <input
                        v-model="form.relativeName"
                        placeholder="Name of Relative/Child"
                        class="form-input"
                      />
                      <input
                        v-model="form.relativeContact"
                        placeholder="Contact #"
                        class="form-input"
                      />
                    </div>
                  </transition>
                </div>

                <!-- Option 3 -->
                <div>
                  <label class="flex items-center gap-2">
                    <input
                      type="radio"
                      v-model="form.living"
                      value="With Non-Relatives"
                      class="accent-emerald-600"
                    />
                    <span>Living with Non-Relatives</span>
                  </label>

                  <!-- Only show when selected -->
                  <transition name="fade">
                    <div v-if="form.living === 'With Non-Relatives'" class="mt-2 space-y-2 pl-6">
                      <input
                        v-model="form.nonrelativeName"
                        placeholder="Name of Non-Relative"
                        class="form-input"
                      />
                      <input
                        v-model="form.nonrelativeContact"
                        placeholder="Contact #"
                        class="form-input"
                      />
                    </div>
                  </transition>
                </div>
              </div>
            </div>


            <div>
              <label class="block font-semibold mb-1">Health Condition</label>

              <select v-model="form.healthCondition" class="form-input">
                <option disabled value="">Select Health Condition</option>
                <option>Healthy</option>
                <option>Sickly/Frail</option>
                <option>Bedridden/Disabled</option>
              </select>

              <!-- Conditionally show this input -->
              <transition name="fade">
                <input
                  v-if="form.healthCondition === 'Bedridden/Disabled'"
                  v-model="form.disability"
                  placeholder="State Disability (if any)"
                  class="form-input mt-2"
                />
              </transition>
            </div>


            <!-- 13. Pensioner -->
            <div>
              <label class="block font-semibold mb-1">Pensioner</label>

              <select v-model="form.pensioner" class="form-input">
                <option disabled value="">Select Pensioner Status</option>
                <option>Yes</option>
                <option>No</option>
              </select>

              <!-- Show pension types only if Yes -->
              <transition name="fade">
                <div v-if="form.pensioner === 'Yes'" class="mt-3">
                  <label class="block font-semibold mb-1">Type of Pension</label>
                  <select v-model="form.pensionType" class="form-input">
                    <option disabled value="">Select Pension Type</option>
                    <option>SSS</option>
                    <option>GSIS</option>
                    <option>PVAO</option>
                    <option>Others</option>
                  </select>

                  <!-- Only show when Others is picked -->
                  <transition name="fade">
                    <input
                      v-if="form.pensionType === 'Others'"
                      v-model="form.pensionOther"
                      placeholder="Please specify other pension type"
                      class="form-input mt-2"
                    />
                  </transition>
                </div>
              </transition>
            </div>

            <!-- 14. Beneficiary -->
            <div>
              <label class="block font-semibold mb-1">Beneficiary</label>

              <select v-model="form.beneficiary" class="form-input">
                <option disabled value="">Select Beneficiary Type</option>
                <option>Pantawid</option>
                <option>Non-Pantawid</option>
                <option>Social Pension Beneficiary</option>
                <option>SSS</option>
                <option>GSIS</option>
                <option>Military</option>
                <option>Others</option>
              </select>

              <!-- Only show when Others is picked -->
              <transition name="fade">
                <input
                  v-if="form.beneficiary === 'Others'"
                  v-model="form.beneficiaryOther"
                  placeholder="Please specify other beneficiary"
                  class="form-input mt-2"
                />
              </transition>
            </div>

            <!-- 15. OSCA ID -->
            <div>
              <label class="block font-semibold mb-1">Have you been issued an OSCA ID Card before?</label>

              <select v-model="form.oscaIssued" class="form-input">
                <option disabled value="">Select an Option</option>
                <option>Yes</option>
                <option>No</option>
              </select>

              <!-- Only show this field when Yes -->
              <transition name="fade">
                <input
                  v-if="form.oscaIssued === 'Yes'"
                  v-model="form.oscaWhenWhere"
                  placeholder="Where and When Issued?"
                  class="form-input mt-2"
                />
              </transition>
            </div>


            <!-- 16. Emergency -->
            <div>
              <label class="block font-semibold mb-1">Whom to notify in case of emergency</label>
              <input v-model="form.emergencyName" placeholder="Name" class="form-input" />
              <input v-model="form.emergencyAddress" placeholder="Address" class="form-input mt-1" />
              <input v-model="form.emergencyContact" placeholder="Contact Number" class="form-input mt-1" />
            </div>

            <!-- 17. Blood Type -->
            <div>
              <label class="block font-semibold mb-1">Blood Type</label>
              <input v-model="form.bloodType" placeholder="A, B, AB, or O" class="form-input" />
            </div>

          </div>

<!-- STEP 4: Oath & Attachments -->
<div v-show="currentStep === 4" class="animate-fade-in space-y-4">
  <!-- Oath Text -->
  <div class="text-sm text-gray-700 leading-relaxed">
    <p>
      I hereby certify that all the above information are true & correct.
      <br><br>
      Further, I authorize OSCA to release the above information to any government agency requesting it.
    </p>
  </div>

  <!-- Signature Upload -->
  <div>
    <label class="block font-semibold mb-1">Applicant’s Signature</label>
    <div
      class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-emerald-50 transition cursor-pointer"
      @click="triggerSignatureUpload"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-emerald-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span class="text-sm text-gray-600">Tap to scan or upload your signature</span>
      <input ref="signatureInput" type="file" accept="image/*" class="hidden" @change="handleSignatureUpload" />
      <img v-if="form.signatureImage" :src="form.signatureImage" alt="Signature Preview" class="mt-3 w-48 border rounded-lg shadow" />
    </div>
  </div>

  <!-- 2x2 Photo Upload -->
  <div>
    <label class="block font-semibold mb-1">2×2 Picture</label>
    <div
      class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-emerald-50 transition cursor-pointer"
      @click="triggerPhotoUpload"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-emerald-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18" />
      </svg>
      <span class="text-sm text-gray-600">Tap to upload 2×2 photo</span>
      <input ref="photoInput" type="file" accept="image/*" class="hidden" @change="handlePhotoUpload" />
      <img v-if="form.photo2x2" :src="form.photo2x2" alt="2x2 Preview" class="mt-3 w-32 h-32 object-cover rounded-lg shadow" />
    </div>
  </div>
</div>

        </form>
      </section>

            <!-- FOOTER NAV -->
      <footer
        class="flex items-center justify-between px-6 py-5 border-t border-emerald-100 bg-white/90 backdrop-blur z-10"
      >
        <!-- Back button only shows after Step 1 -->
        <div>
          <button
            v-if="currentStep > 1"
            @click="prevStep"
            class="btn-secondary"
          >
            Back
          </button>
        </div>

        <!-- Right-aligned action buttons -->
        <div class="ml-auto">
          <button
            v-if="currentStep < totalSteps"
            @click="nextStep"
            class="btn-primary"
          >
            Next
          </button>
          <button
            v-if="currentStep === totalSteps"
            @click="onSubmit"
            class="btn-primary"
          >
            Submit
          </button>
        </div>
      </footer>

    </main>

    <!-- Floating Mic -->
    <button
      @click="$emit('mic')"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-5 shadow-2xl focus:ring-4 focus:ring-emerald-300 transition-all z-50"
      title="Tap to Speak"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z" />
        <path d="M19 11a1 1 0 1 0-2 0 5 5 0 1 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V20H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-2.08A7 7 0 0 0 19 11z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';



const currentStep = ref(1);
const totalSteps = 4;

const form = reactive({
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  age: "",
  citizenship: "Filipino",
  civilStatus: "Married",
  dob: "",
  pob: "",
  address: "",
  barangay: "",
  landline: "",
  mobile: "",
  education: "",
  philhealth: "",
  living: "",
  relativeContact: "",
  nonrelativeContact: "",
  healthCondition: "",
  disability: "",
  pensioner: "",
  oscaIssued: "",
  oscaWhenWhere: "",
  emergencyName: "",
  emergencyAddress: "",
  emergencyContact: "",
  bloodType: "",
  signature: "",
  relativeName: "",
  nonrelativeName: "",
  signatureImage: "",
  photo2x2: "",
    pensionType: "",     
  pensionOther: "",         
  beneficiary: "",          
  beneficiaryOther: "",

});

const stepLabel = computed(() => {
  if (currentStep.value === 1) return "Personal Information";
  if (currentStep.value === 2) return "Contact & Membership";
  if (currentStep.value === 3) return "Additional Information";
  if (currentStep.value === 4) return "Oath";
  return "";
});
const progressWidth = computed(() => `${(currentStep.value / totalSteps) * 100}%`);

function nextStep() {
  if (currentStep.value < totalSteps) currentStep.value++;
}
function prevStep() {
  if (currentStep.value > 1) currentStep.value--;
}

function calculateAge() {
  if (!form.dob) return;
  const birth = new Date(form.dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  form.age = age.toString();
}

function onSubmit() {
  alert("Form submitted successfully!");
}

function saveAsDraft() {
  // In real use, connect to Supabase or localStorage here.
  alert("Your progress has been saved as draft!");
}

const signatureInput = ref<HTMLInputElement | null>(null);
const photoInput = ref<HTMLInputElement | null>(null);

function triggerSignatureUpload() {
  signatureInput.value?.click();
}

function triggerPhotoUpload() {
  photoInput.value?.click();
}

function handleSignatureUpload(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) form.signatureImage = URL.createObjectURL(file);
}

function handlePhotoUpload(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) form.photo2x2 = URL.createObjectURL(file);
}


</script>

<style scoped>
.form-input {
  @apply w-full rounded-xl border border-gray-300 p-3 text-gray-700 text-base focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all;
}
.btn-primary {
  @apply bg-emerald-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-emerald-700 transition;
}
.btn-secondary {
  @apply border border-gray-300 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 transition;
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.custom-scroll {
  scrollbar-width: none;
}
.custom-scroll::-webkit-scrollbar {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}


</style>
