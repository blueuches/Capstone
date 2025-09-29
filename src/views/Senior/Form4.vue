<!-- OctoNonaCenteForm.vue -->
<template>
  <div class="bg-gradient-to-b from-emerald-50 to-white min-h-screen flex flex-col items-center py-10">
    <main class="w-full max-w-5xl px-6">
      <!-- Headers -->
      <header class="text-center mb-6">
        <router-link to="/senior/dashboard"
          class="absolute top-3 left-4 text-emerald-700 text-lg sm:text-xl font-semibold drop-shadow-md tracking-wide"
        >
          ← Dashboard
        </router-link>
        <h1 class="text-3xl md:text-4xl font-extrabold text-emerald-700">Application Form</h1>
        <h2 class="text-2xl md:text-3xl font-extrabold text-emerald-500">
          Octogenarian, Nonagenarian &amp; Centenarian Benefit Program
        </h2>
      </header>

      <!-- Purpose & Instructions -->
      <section class="bg-white border border-emerald-200 rounded-lg shadow p-4 text-left max-w-3xl mx-auto mb-6">
        <p class="text-sm text-gray-700">
          <span class="font-semibold text-emerald-700">Purpose:</span>
          To claim the benefits under Republic Act (R.A) No. 11982
        </p>
        <h3 class="text-sm font-semibold text-emerald-700 mt-3">Instructions:</h3>
        <ol class="text-sm list-decimal list-inside space-y-1 mt-1 text-gray-700">
          <li>Fill out this form completely and correctly</li>
          <li>Do not leave any blank space, if not applicable, kindly indicate "N/A"</li>
          <li>Write in CAPITAL letters</li>
        </ol>
      </section>

      <!-- Requirements -->
      <section class="bg-white border border-emerald-200 rounded-lg shadow p-4 mb-6">
        <h2 class="text-lg font-semibold text-emerald-700 mb-2">
          Octogenarian, Nonagenarian &amp; Centenarian Requirements
        </h2>
        <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>a. Whole body picture with white background, printed in A4 size bond paper</li>
          <li>b. 1pc. 2x2 picture with white background</li>
          <li>c. Birth Certificate PSA Copy (original)</li>
          <li>d. National ID / SSS / GSIS ID / UMID / Voter's ID / Voter's Certificate / PhilHealth</li>
          <li>e. OSCA ID</li>
          <li>
            f. RRN (online registration through
            <a href="https://ncsc.gov.ph" class="text-emerald-600 underline" target="_blank" rel="noopener">ncsc.gov.ph</a>)
          </li>
        </ul>
      </section>

      <!-- Stepper -->
      <section aria-label="Progress" class="bg-white rounded-xl shadow px-4 py-3 mb-6">
        <div class="flex items-center justify-between text-sm text-gray-700">
          <div class="flex items-center gap-2 flex-wrap">
            <div
              v-for="i in totalSteps"
              :key="i"
              class="w-8 h-8 rounded-full font-bold grid place-items-center"
              :class="i <= currentStep ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'"
            >
              {{ i < currentStep ? '✓' : i }}
            </div>
          </div>
          <div>Step <span>{{ currentStep }}</span> of {{ totalSteps }}</div>
        </div>
      </section>

      <!-- Form -->
      <form ref="formRef" class="bg-white rounded-2xl shadow-md p-6 space-y-6" @submit.prevent="onSubmit">
        <!-- Step 1 -->
        <div v-show="currentStep === 1" class="fade-in" id="step-1">
          <h3 class="text-xl font-semibold text-emerald-600 mb-4">Step 1: Upload &amp; Milestone Age</h3>
          <label class="block font-medium mb-1">Upload 2x2 ID Picture</label>
          <input name="id_2x2" type="file" accept="image/*" class="border p-2 rounded w-full mb-4" />
          <label class="block font-medium mb-1">Applicant for Milestone Age</label>
          <select name="milestone_age" class="w-full border p-2 rounded">
            <option>80</option><option>85</option><option>90</option><option>95</option><option>100</option>
          </select>
          <div class="flex justify-end mt-6">
            <button type="button" @click="nextStep" class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">
              Next
            </button>
          </div>
        </div>

        <!-- Step 2 -->
        <div v-show="currentStep === 2" class="fade-in" id="step-2">
          <h3 class="text-xl font-semibold text-emerald-600 mb-4">Step 2: Personal Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="rrn" type="text" placeholder="NCSC Registration Reference Number" class="border p-2 rounded" />
            <input name="osca_id" type="text" placeholder="OSCA ID Number" class="border p-2 rounded" />
            <input name="last_name" type="text" placeholder="Last Name" class="border p-2 rounded" />
            <input name="given_name" type="text" placeholder="Given Name" class="border p-2 rounded" />
            <input name="middle_name" type="text" placeholder="Middle Name" class="border p-2 rounded" />
            <input name="dob" type="text" placeholder="Date of Birth (MM DD YYYY)" class="border p-2 rounded" />
            <input name="age" type="text" placeholder="Age" class="border p-2 rounded" />
            <input name="res_address" type="text" placeholder="Residential Address / Address Abroad" class="border p-2 rounded" />
            <input name="perm_address" type="text" placeholder="Permanent Address in the Philippines" class="border p-2 rounded" />
            <input name="sex" type="text" placeholder="Sex" class="border p-2 rounded" />
            <input name="civil_status" type="text" placeholder="Civil Status" class="border p-2 rounded" />
            <input name="citizenship" type="text" placeholder="Citizenship (If dual, indicate details)" class="border p-2 rounded" />
          </div>
          <div class="flex justify-between mt-6">
            <button type="button" @click="prevStep" class="px-6 py-2 border rounded hover:bg-gray-100">Back</button>
            <button type="button" @click="nextStep" class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">Next</button>
          </div>
        </div>

        <!-- Step 3 -->
        <div v-show="currentStep === 3" class="fade-in" id="step-3">
          <h3 class="text-xl font-semibold text-emerald-600 mb-4">Step 3: Family Information</h3>
          <input name="spouse_name" type="text" placeholder="Spouse Name (Last, Given, Middle, Ext.)" class="border p-2 rounded w-full mb-2" />
          <input name="spouse_citizenship" type="text" placeholder="Spouse Citizenship" class="border p-2 rounded w-full mb-2" />
          <textarea name="children" class="border p-2 rounded w-full mb-2" placeholder="Children Names (Up to 10)"></textarea>
          <textarea name="authorized_reps" class="border p-2 rounded w-full mb-2" placeholder="Authorized Representatives (Up to 3, include relationship)"></textarea>
          <div class="flex justify-between mt-6">
            <button type="button" @click="prevStep" class="px-6 py-2 border rounded hover:bg-gray-100">Back</button>
            <button type="button" @click="nextStep" class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">Next</button>
          </div>
        </div>

        <!-- Step 4 -->
        <div v-show="currentStep === 4" class="fade-in" id="step-4">
          <h3 class="text-xl font-semibold text-emerald-600 mb-4">Step 4: Contact Information</h3>
          <input name="contact_numbers" type="text" placeholder="Contact Numbers" class="border p-2 rounded w-full mb-2" />
          <input name="email" type="email" placeholder="Email Address" class="border p-2 rounded w-full" />
          <div class="flex justify-between mt-6">
            <button type="button" @click="prevStep" class="px-6 py-2 border rounded hover:bg-gray-100">Back</button>
            <button type="button" @click="nextStep" class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">Next</button>
          </div>
        </div>

        <!-- Step 5 -->
        <div v-show="currentStep === 5" class="fade-in" id="step-5">
          <h3 class="text-xl font-semibold text-emerald-600 mb-4">Step 5: Designated Beneficiary</h3>
          <input name="benef_primary" type="text" placeholder="Primary Beneficiary" class="border p-2 rounded w-full mb-2" />
          <input name="benef_primary_rel" type="text" placeholder="Relationship to Primary" class="border p-2 rounded w-full mb-2" />
          <input name="benef_contingent" type="text" placeholder="Contingent Beneficiary" class="border p-2 rounded w-full mb-2" />
          <input name="benef_contingent_rel" type="text" placeholder="Relationship to Contingent" class="border p-2 rounded w-full mb-2" />
          <div class="flex justify-between mt-6">
            <button type="button" @click="prevStep" class="px-6 py-2 border rounded hover:bg-gray-100">Back</button>
            <button type="button" @click="nextStep" class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">Next</button>
          </div>
        </div>

        <!-- Step 6 -->
        <div v-show="currentStep === 6" class="fade-in" id="step-6">
          <h3 class="text-xl font-semibold text-emerald-600 mb-4">Step 6: Utilization of Cash Gifts</h3>
          <div class="space-y-2">
            <label class="block"><input type="checkbox" name="utilization" value="Food" /> Food</label>
            <label class="block"><input type="checkbox" name="utilization" value="Medical Checkup" /> Medical Checkup</label>
            <label class="block"><input type="checkbox" name="utilization" value="Medicine/Vitamins" /> Medicine/Vitamins</label>
            <label class="block"><input type="checkbox" name="utilization" value="Livelihood/Entrepreneurial" /> Livelihood / Entrepreneurial</label>
            <label class="block">Others: <input name="utilization_other" type="text" class="border p-1 rounded ml-2" /></label>
          </div>
          <div class="flex justify-between mt-6">
            <button type="button" @click="prevStep" class="px-6 py-2 border rounded hover:bg-gray-100">Back</button>
            <button type="button" @click="nextStep" class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">Next</button>
          </div>
        </div>

        <!-- Step 7 -->
        <div v-show="currentStep === 7" class="fade-in" id="step-7">
          <h3 class="text-xl font-semibold text-emerald-600 mb-4">Step 7: Certification</h3>
          <textarea rows="8" class="w-full border p-2 rounded text-sm mb-4" readonly>
I hereby certify under oath that all the information in this application form are true and correct. I authorize 
the verification of the information provided in this form as well as the usage and processing of the information by 
the National Commission of Senior Citizens in accordance with the R.A. No. 10173, otherwise known as the "Data Privacy 
Act of 2012", its Implementing Rules and Regulations, and issuances of the National Privacy Commission. I further 
warrant that I have complied with all the requirements and I have presented all pertinent documentary requirements. 
I understand that my application shall not be processed if any statement herein made is found to be false, or if 
any document I submitted is found to have been falsified, or if I fail to comply with all the requirements with 
respect to my application, without prejudice to whatever actions that may be taken against me in accordance with 
the applicable laws of the Republic of the Philippines. Further, I hereby certify that I have not commenced the 
application/processing for the cash benefits as provided for under R.A. No. 11982 before any government agency.
          </textarea>

          <input name="applicant_signature" type="text" placeholder="Applicant Name & Signature/Thumbmark" class="border p-2 rounded w-full mb-2" />
          <input name="application_date" type="date" placeholder="Date of Application" class="border p-2 rounded w-full mb-2" />

          <h4 class="text-md font-semibold text-emerald-600 mt-4">Government ID</h4>
          <input name="gov_id_type" type="text" placeholder="ID Type" class="border p-2 rounded w-full mb-2" />
          <input name="gov_id_number" type="text" placeholder="ID Number" class="border p-2 rounded w-full mb-2" />
          <input name="gov_id_date_issued" type="date" placeholder="Date Issued" class="border p-2 rounded w-full mb-2" />
          <input name="gov_id_issued_at" type="text" placeholder="Issued At" class="border p-2 rounded w-full mb-2" />
          <input name="gov_id_valid_until" type="date" placeholder="Valid Until" class="border p-2 rounded w-full mb-2" />
          <input name="admin_officer" type="text" placeholder="Administering Officer (Signature over printed name)" class="border p-2 rounded w-full mb-2" />

          <div class="flex justify-between mt-6">
            <button type="button" @click="prevStep" class="px-6 py-2 border rounded hover:bg-gray-100">Back</button>
            <button type="button" @click="nextStep" class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">Next</button>
          </div>
        </div>

        <!-- Step 8 -->
        <div v-show="currentStep === 8" class="fade-in" id="step-8">
          <h3 class="text-xl font-semibold text-emerald-600 mb-4">Step 8: Documentary Requirements (Staff Only)</h3>
          <p class="text-sm text-gray-700 mb-4">
            G. DOCUMENTARY REQUIREMENTS (to be filled-up by NCSC personnel only)
          </p>

          <div class="overflow-x-auto">
            <table class="w-full border text-sm mb-6 min-w-[700px]">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border p-2 w-1/6">Applicants</th>
                  <th class="border p-2 w-1/2">Requirements</th>
                  <th class="border p-2 w-1/6">Complied</th>
                  <th class="border p-2 w-1/6">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <!-- Local Applicants -->
                <tr>
                  <td class="border p-2 align-top" rowspan="5">Local Applicants</td>
                  <td class="border p-2"><strong>a.</strong> Duly accomplished application form "Annex A"</td>
                  <td class="border p-2 text-center">
                    <label class="mr-2"><input type="radio" name="local_a" value="Yes" /> Yes</label>
                    <label><input type="radio" name="local_a" value="No" /> No</label>
                  </td>
                  <td class="border p-2"><input name="local_a_remarks" type="text" class="w-full border rounded p-1" /></td>
                </tr>
                <tr>
                  <td class="border p-2">
                    <strong>b.</strong> Any one (1) of the following primary documents:
                    <ul class="list-disc list-inside ml-4">
                      <li>Certificate of Live Birth (PSA)</li>
                      <li>PhilSys/Philippine ID/National ID (original must be presented)</li>
                    </ul>
                    <p class="italic mt-1">*** If no primary ID, submit any two (2) secondary IDs per Guidelines VI</p>
                  </td>
                  <td class="border p-2 text-center">
                    <label class="mr-2"><input type="radio" name="local_b" value="Yes" /> Yes</label>
                    <label><input type="radio" name="local_b" value="No" /> No</label>
                  </td>
                  <td class="border p-2"><input name="local_b_remarks" type="text" class="w-full border rounded p-1" /></td>
                </tr>
                <tr>
                  <td class="border p-2"><strong>c.</strong> Recent 2x2 ID picture (5.08 cm x 5.08 cm)</td>
                  <td class="border p-2 text-center">
                    <label class="mr-2"><input type="radio" name="local_c" value="Yes" /> Yes</label>
                    <label><input type="radio" name="local_c" value="No" /> No</label>
                  </td>
                  <td class="border p-2"><input name="local_c_remarks" type="text" class="w-full border rounded p-1" /></td>
                </tr>
                <tr>
                  <td class="border p-2"><strong>d.</strong> Full body picture printed on A4 size bond/photo paper</td>
                  <td class="border p-2 text-center">
                    <label class="mr-2"><input type="radio" name="local_d" value="Yes" /> Yes</label>
                    <label><input type="radio" name="local_d" value="No" /> No</label>
                  </td>
                  <td class="border p-2"><input name="local_d_remarks" type="text" class="w-full border rounded p-1" /></td>
                </tr>
                <tr>
                  <td class="border p-2"><strong>e.</strong> Applicant’s inclusion in endorsed list for validation issued by LCE</td>
                  <td class="border p-2 text-center">
                    <label class="mr-2"><input type="radio" name="local_e" value="Yes" /> Yes</label>
                    <label><input type="radio" name="local_e" value="No" /> No</label>
                  </td>
                  <td class="border p-2"><input name="local_e_remarks" type="text" class="w-full border rounded p-1" /></td>
                </tr>

                <!-- Applicants Living Abroad -->
                <tr>
                  <td class="border p-2 align-top" rowspan="5">Applicants Living Abroad</td>
                  <td class="border p-2"><strong>a.</strong> Duly accomplished application form "Annex A"</td>
                  <td class="border p-2 text-center">
                    <label class="mr-2"><input type="radio" name="abroad_a" value="Yes" /> Yes</label>
                    <label><input type="radio" name="abroad_a" value="No" /> No</label>
                  </td>
                  <td class="border p-2"><input name="abroad_a_remarks" type="text" class="w-full border rounded p-1" /></td>
                </tr>
                <tr>
                  <td class="border p-2">
                    <strong>b.</strong> Any one (1) of the following primary documents:
                    <ul class="list-disc list-inside ml-4">
                      <li>Valid Philippine Passport</li>
                      <li>Citizen Retention &amp; Re-acquisition Certificate / Identification Certificate</li>
                      <li>Order of Approval / Oath of Allegiance / Certificate of Attestation (PE/PCG of DFA)</li>
                    </ul>
                    <p class="italic mt-1">*** If no primary ID, submit any two (2) secondary IDs per Guidelines VI</p>
                  </td>
                  <td class="border p-2 text-center">
                    <label class="mr-2"><input type="radio" name="abroad_b" value="Yes" /> Yes</label>
                    <label><input type="radio" name="abroad_b" value="No" /> No</label>
                  </td>
                  <td class="border p-2"><input name="abroad_b_remarks" type="text" class="w-full border rounded p-1" /></td>
                </tr>
                <tr>
                  <td class="border p-2"><strong>c.</strong> Recent 2x2 ID picture (5.08 cm x 5.08 cm)</td>
                  <td class="border p-2 text-center">
                    <label class="mr-2"><input type="radio" name="abroad_c" value="Yes" /> Yes</label>
                    <label><input type="radio" name="abroad_c" value="No" /> No</label>
                  </td>
                  <td class="border p-2"><input name="abroad_c_remarks" type="text" class="w-full border rounded p-1" /></td>
                </tr>
                <tr>
                  <td class="border p-2"><strong>d.</strong> Full body picture printed on A4 size bond/photo paper</td>
                  <td class="border p-2 text-center">
                    <label class="mr-2"><input type="radio" name="abroad_d" value="Yes" /> Yes</label>
                    <label><input type="radio" name="abroad_d" value="No" /> No</label>
                  </td>
                  <td class="border p-2"><input name="abroad_d_remarks" type="text" class="w-full border rounded p-1" /></td>
                </tr>
                <tr>
                  <td class="border p-2"><strong>e.</strong> Applicant’s inclusion in endorsed list issued by PE/Consulate, DFA, DMW, or CFO</td>
                  <td class="border p-2 text-center">
                    <label class="mr-2"><input type="radio" name="abroad_e" value="Yes" /> Yes</label>
                    <label><input type="radio" name="abroad_e" value="No" /> No</label>
                  </td>
                  <td class="border p-2"><input name="abroad_e_remarks" type="text" class="w-full border rounded p-1" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-between mt-6">
            <button type="button" @click="prevStep" class="px-6 py-2 border rounded hover:bg-gray-100">Back</button>
            <button type="button" @click="nextStep" class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">Next</button>
          </div>
        </div>

        <!-- Step 9 -->
        <div v-show="currentStep === 9" class="fade-in" id="step-9">
          <h3 class="text-xl font-semibold text-emerald-600 mb-4">Step 9: Validation Assessment Report (Staff Only)</h3>
          <textarea name="validation_notes" class="w-full border p-2 rounded mb-2" placeholder="Findings / Concerns / Recommendations"></textarea>
          <div class="space-x-4 mb-2">
            <label><input type="radio" name="assessment" value="Eligible" /> Eligible</label>
            <label><input type="radio" name="assessment" value="Ineligible" /> Ineligible</label>
          </div>
          <input name="validator_name" type="text" placeholder="Validator Name (Signature over printed name)" class="border p-2 rounded w-full mb-2" />
          <input name="validation_date" type="date" class="border p-2 rounded w-full" />
          <div class="flex justify-between mt-6">
            <button type="button" @click="prevStep" class="px-6 py-2 border rounded hover:bg-gray-100">Back</button>
            <button type="button" @click="nextStep" class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">Next</button>
          </div>
        </div>

        <!-- Step 10 -->
        <div v-show="currentStep === 10" class="fade-in" id="step-10">
          <h3 class="text-xl font-semibold text-emerald-600 mb-4">Step 10: Applicant Confirmation &amp; Data Privacy</h3>
          <input name="final_applicant_name" type="text" placeholder="Applicant Name & Signature/Thumbmark" class="border p-2 rounded w-full mb-2" />
          <textarea name="final_signature" rows="3" class="w-full border p-2 rounded mb-2" placeholder="Signature/Thumbmark"></textarea>
          <p class="text-sm text-gray-700 mb-4">In compliance with the Data Privacy Act of 2012 (R.A. No. 10173)...</p>
          <div class="flex justify-between mt-6">
            <button type="button" @click="prevStep" class="px-6 py-2 border rounded hover:bg-gray-100">Back</button>
            <button type="submit" class="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">Submit</button>
          </div>
        </div>
      </form>
    </main>

    <!-- Global Mic Button -->
    <div class="fixed bottom-5 right-5">
      <button
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

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)
const totalSteps = 10
const formRef = ref(null)

function nextStep() {
  if (currentStep.value < totalSteps) currentStep.value++
}
function prevStep() {
  if (currentStep.value > 1) currentStep.value--
}

function onSubmit(e) {
  const form = formRef.value
  const fd = new FormData(form)
  const payload = {}
  for (const [k, v] of fd.entries()) {
    if (payload[k]) {
      if (Array.isArray(payload[k])) payload[k].push(v)
      else payload[k] = [payload[k], v]
    } else {
      payload[k] = v
    }
  }
  // Replace with Supabase insert + TTS confirmation as needed
  alert('Form submitted. Data captured.')
  console.log('Form payload:', payload)
}
</script>

<style scoped>
.fade-in { animation: fade 200ms ease-in; }
@keyframes fade { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: none } }
</style>
