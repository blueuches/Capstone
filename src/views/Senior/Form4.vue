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
          ONC Program Application Form
        </h1>

        <!-- PROGRESS BAR -->
        <div class="w-[85%] mt-3">
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

      <!-- CONTENT -->
      <section class="flex-1 overflow-y-auto px-5 py-4 custom-scroll">
        <!-- STEP 1 -->
        <div v-show="currentStep === 1" class="animate-fade-in space-y-4">
          <h3 class="text-lg font-semibold text-emerald-700">Upload & Milestone Age</h3>

          <div>
            <label class="block font-semibold mb-1">Upload 2×2 Picture</label>
            <input type="file" accept="image/*" class="form-input" />
          </div>

          <div>
            <label class="block font-semibold mb-1">Milestone Age</label>
            <select v-model="form.milestone" class="form-input">
              <option disabled value="">Select Age</option>
              <option>80</option>
              <option>85</option>
              <option>90</option>
              <option>95</option>
              <option>100</option>
            </select>
          </div>
        </div>

        <!-- STEP 2 -->
        <div v-show="currentStep === 2" class="animate-fade-in space-y-3">
          <input v-model="form.rrn" placeholder="NCSC Registration Reference No." class="form-input" />
          <input v-model="form.oscaId" placeholder="OSCA ID Number" class="form-input" />
          <input v-model="form.lastName" placeholder="Last Name" class="form-input" />
          <input v-model="form.firstName" placeholder="First Name" class="form-input" />
          <input v-model="form.middleName" placeholder="Middle Name" class="form-input" />
          <input v-model="form.dob" placeholder="Date of Birth (MM/DD/YYYY)" class="form-input" />
          <input v-model="form.age" placeholder="Age" class="form-input" />
          <input v-model="form.resAddress" placeholder="Residential Address / Abroad" class="form-input" />
          <input v-model="form.permAddress" placeholder="Permanent Address in the Philippines" class="form-input" />
          <select v-model="form.sex" class="form-input">
            <option disabled value="">Sex</option>
            <option>Male</option>
            <option>Female</option>
          </select>
          <input v-model="form.civilStatus" placeholder="Civil Status" class="form-input" />
          <input v-model="form.citizenship" placeholder="Citizenship (If dual, indicate details)" class="form-input" />
        </div>

        <!-- STEP 3 -->
        <div v-show="currentStep === 3" class="animate-fade-in space-y-3">
          <h3 class="text-lg font-semibold text-emerald-700">Family Information</h3>
          <input v-model="form.spouse" placeholder="Spouse Name" class="form-input" />
          <input v-model="form.spouseCitizenship" placeholder="Spouse Citizenship" class="form-input" />
          <textarea v-model="form.children" placeholder="Children Names (Up to 10)" class="form-input h-24"></textarea>
          <textarea v-model="form.representatives" placeholder="Authorized Representatives (Up to 3, include relationship)" class="form-input h-24"></textarea>
        </div>

        <!-- STEP 4 -->
        <div v-show="currentStep === 4" class="animate-fade-in space-y-3">
          <h3 class="text-lg font-semibold text-emerald-700">Contact Information</h3>
          <input v-model="form.contactNumbers" placeholder="Contact Numbers" class="form-input" />
          <input v-model="form.email" placeholder="Email Address" class="form-input" />
        </div>

        <!-- STEP 5 -->
        <div v-show="currentStep === 5" class="animate-fade-in space-y-3">
          <h3 class="text-lg font-semibold text-emerald-700">Designated Beneficiary</h3>
          <input v-model="form.primaryBenef" placeholder="Primary Beneficiary" class="form-input" />
          <input v-model="form.primaryRel" placeholder="Relationship to Primary" class="form-input" />
          <input v-model="form.contingentBenef" placeholder="Contingent Beneficiary" class="form-input" />
          <input v-model="form.contingentRel" placeholder="Relationship to Contingent" class="form-input" />
        </div>

        <!-- STEP 6 -->
        <div v-show="currentStep === 6" class="animate-fade-in space-y-3">
          <h3 class="text-lg font-semibold text-emerald-700">Utilization of Cash Gifts</h3>
          <div class="space-y-2 text-sm">
            <label><input type="checkbox" value="Food" v-model="form.utilization" /> Food</label><br />
            <label><input type="checkbox" value="Medical Checkup" v-model="form.utilization" /> Medical Checkup</label><br />
            <label><input type="checkbox" value="Medicine/Vitamins" v-model="form.utilization" /> Medicine/Vitamins</label><br />
            <label><input type="checkbox" value="Livelihood/Entrepreneurial" v-model="form.utilization" /> Livelihood / Entrepreneurial</label><br />
            <label>Others: <input v-model="form.utilizationOther" placeholder="Specify" class="border p-1 rounded ml-1" /></label>
          </div>
        </div>

        <!-- STEP 7 -->
        <div v-show="currentStep === 7" class="animate-fade-in space-y-3">
          <h3 class="text-lg font-semibold text-emerald-700">Certification & ID</h3>
          <textarea readonly rows="6" class="form-input text-sm">
I hereby certify under oath that all the information in this application form are true and correct. I authorize 
the verification of the information provided in this form as well as the usage and processing of the information by 
the National Commission of Senior Citizens in accordance with R.A. No. 10173 (Data Privacy Act of 2012).
          </textarea>
          <input v-model="form.signature" placeholder="Applicant Signature / Thumbmark" class="form-input" />
          <input v-model="form.applicationDate" type="date" class="form-input" />
        </div>

        <!-- STEP 8 -->
        <div v-show="currentStep === 8" class="animate-fade-in space-y-3">
          <h3 class="text-lg font-semibold text-emerald-700">Validation & Assessment</h3>
          <textarea v-model="form.validationNotes" placeholder="Findings / Recommendations" class="form-input h-24"></textarea>
          <select v-model="form.assessment" class="form-input">
            <option disabled value="">Assessment Result</option>
            <option>Eligible</option>
            <option>Ineligible</option>
          </select>
          <input v-model="form.validator" placeholder="Validator Name" class="form-input" />
          <input v-model="form.validationDate" type="date" class="form-input" />
        </div>

        <!-- STEP 9 -->
        <div v-show="currentStep === 9" class="animate-fade-in space-y-3">
          <h3 class="text-lg font-semibold text-emerald-700">Confirmation & Data Privacy</h3>
          <input v-model="form.finalApplicant" placeholder="Applicant Name" class="form-input" />
          <textarea v-model="form.finalSignature" rows="3" placeholder="Signature/Thumbmark" class="form-input"></textarea>
          <p class="text-xs text-gray-600">In compliance with the Data Privacy Act of 2012 (R.A. No. 10173)...</p>
        </div>
      </section>

      <!-- FOOTER NAV -->
      <footer class="flex items-center justify-between px-6 py-4 border-t border-emerald-100 bg-white/90 backdrop-blur z-10">
        <button v-if="currentStep > 1" @click="prevStep" class="btn-secondary">Back</button>
        <div class="ml-auto">
          <button v-if="currentStep < totalSteps" @click="nextStep" class="btn-primary">Next</button>
          <button v-else @click="onSubmit" class="btn-primary">Submit</button>
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

const currentStep = ref(1);
const totalSteps = 9;

const form = reactive({
  milestone: "",
  rrn: "",
  oscaId: "",
  lastName: "",
  firstName: "",
  middleName: "",
  dob: "",
  age: "",
  resAddress: "",
  permAddress: "",
  sex: "",
  civilStatus: "",
  citizenship: "",
  spouse: "",
  spouseCitizenship: "",
  children: "",
  representatives: "",
  contactNumbers: "",
  email: "",
  primaryBenef: "",
  primaryRel: "",
  contingentBenef: "",
  contingentRel: "",
  utilization: [],
  utilizationOther: "",
  signature: "",
  applicationDate: "",
  validationNotes: "",
  assessment: "",
  validator: "",
  validationDate: "",
  finalApplicant: "",
  finalSignature: "",
});

const stepLabel = computed(() => {
  const labels = [
    "Upload & Milestone",
    "Personal Information",
    "Family Information",
    "Contact Information",
    "Beneficiary",
    "Utilization",
    "Certification",
    "Assessment",
    "Confirmation",
  ];
  return labels[currentStep.value - 1];
});

const progressWidth = computed(() => `${(currentStep.value / totalSteps) * 100}%`);

function nextStep() {
  if (currentStep.value < totalSteps) currentStep.value++;
}
function prevStep() {
  if (currentStep.value > 1) currentStep.value--;
}
function onSubmit() {
  alert("Form submitted successfully!");
}

function saveAsDraft() {
  // In real use, connect to Supabase or localStorage here.
  alert("Your progress has been saved as draft!");
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
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}
.custom-scroll::-webkit-scrollbar {
  display: none;
}
</style>
