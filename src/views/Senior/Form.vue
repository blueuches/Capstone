<template>
  <!-- Header -->
  <header class="sticky top-0 z-20 bg-[#087d48] text-white">
    <div class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="h-8 w-8 rounded-full bg-white/20"></div>
        <h1 class="font-semibold tracking-wide">SeniorGo</h1>
        <span class="hidden sm:inline text-white/80">• OSCA Program Application Form</span>
      </div>
      <div class="flex items-center gap-2">
        <button class="text-sm px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">EN</button>
        <button class="text-sm px-3 py-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">CEB</button>
        <button class="ml-2 h-8 w-8 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white" aria-label="Help">?</button>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6">
    <!-- Card container -->
    <div class="bg-[#F7FAFC] rounded-2xl shadow-md md:shadow-lg border border-slate-200">
      <div class="px-4 md:px-6 lg:px-8 py-5 border-b">
        <h2 class="text-lg font-semibold text-[#0B1320]">OSCA Program Application Form</h2>
      </div>

      <div class="px-4 md:px-6 lg:px-8 py-6 space-y-8">
        <!-- TOP: Photo / Age Bracket / RRN -->
        <section class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- 2x2 ID Photo -->
            <div class="col-span-1">
              <label for="idpic" class="block text-sm font-medium text-[#0B1320]">2×2 ID Picture</label>
              <div class="mt-2">
                <div class="flex items-center gap-3">
                  <div class="h-24 w-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-xs text-slate-500">
                    2×2
                  </div>
                  <div class="flex-1">
                    <div class="relative">
                      <input id="idpic" type="file" class="w-full cursor-default rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]" />
                      <span class="absolute right-3 top-2.5 text-slate-400 text-xs">Choose File</span>
                    </div>
                    <!-- With-file chip (visual only) -->
                    <div class="mt-2 inline-flex items-center gap-2 text-xs bg-white border border-slate-300 rounded-full px-3 py-1">
                      <span>id_photo.png</span>
                      <span class="text-slate-400">✕</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Age Bracket -->
            <div class="col-span-1">
              <span class="block text-sm font-medium text-[#0B1320]">Age Bracket</span>
              <div class="mt-2 grid grid-cols-5 gap-2">
                <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm">
                  <input type="radio" name="agebr" class="h-4 w-4" />
                  <span>80</span>
                </label>
                <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm">
                  <input type="radio" name="agebr" class="h-4 w-4" />
                  <span>85</span>
                </label>
                <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm">
                  <input type="radio" name="agebr" class="h-4 w-4" />
                  <span>90</span>
                </label>
                <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm">
                  <input type="radio" name="agebr" class="h-4 w-4" />
                  <span>95</span>
                </label>
                <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm">
                  <input type="radio" name="agebr" class="h-4 w-4" />
                  <span>100</span>
                </label>
              </div>
            </div>

            <!-- RRN -->
            <div class="col-span-1">
              <label for="rrn" class="block text-sm font-medium text-[#0B1320]">NCSC Registration Reference Number (RRN)</label>
              <input id="rrn" type="text" placeholder="Enter RRN" class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]" />
            </div>
          </div>
        </section>

        <!-- A. PERSONAL INFORMATION -->
        <section class="space-y-4">
          <h3 class="text-base font-semibold text-[#0B1320]">A. PERSONAL INFORMATION</h3>

          <!-- Name grid with one error example on Full Name (we'll apply to Last Name) -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="lname" class="block text-sm font-medium text-[#0B1320]">a.1. Last name</label>
              <input id="lname" type="text" placeholder="Enter your last name"
                     class="mt-2 w-full rounded-lg border border-[#D32F2F] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]" />
              <p class="mt-1 text-xs text-[#D32F2F]">Please provide your last name.</p>
            </div>
            <div>
              <label for="gname" class="block text-sm font-medium text-[#0B1320]">a.2. Given name</label>
              <input id="gname" type="text" placeholder="Enter your given name"
                     class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]" />
            </div>
            <div>
              <label for="mname" class="block text-sm font-medium text-[#0B1320]">a.3. Middle name</label>
              <input id="mname" type="text" placeholder="Enter your middle name"
                     class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="dob" class="block text-sm font-medium text-[#0B1320]">a.4. Date of birth (M D Y)</label>
              <div class="mt-2 relative">
                <input id="dob" type="text" placeholder="MM/DD/YYYY"
                       class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]" />
                <span class="absolute right-3 top-2.5 text-slate-400">📅</span>
              </div>
            </div>
            <div>
              <label for="age" class="block text-sm font-medium text-[#0B1320]">a.5. Age</label>
              <input id="age" type="number" placeholder="e.g., 80"
                     class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]" />
            </div>
            <div>
              <span class="block text-sm font-medium text-[#0B1320]">a.8. Sex</span>
              <div class="mt-2 flex gap-4">
                <label class="inline-flex items-center gap-2">
                  <input type="radio" name="sex" class="h-4 w-4" />
                  <span class="text-sm">Male</span>
                </label>
                <label class="inline-flex items-center gap-2">
                  <input type="radio" name="sex" class="h-4 w-4" />
                  <span class="text-sm">Female</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Addresses -->
          <div class="space-y-3">
            <h4 class="text-sm font-medium text-[#0B1320]">a.6. Residential address / address abroad</h4>
            <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
              <input type="text" placeholder="House No." class="input" />
              <input type="text" placeholder="Street" class="input md:col-span-2" />
              <input type="text" placeholder="Barangay" class="input" />
              <input type="text" placeholder="City/Municipality" class="input" />
              <input type="text" placeholder="Province" class="input" />
              <input type="text" placeholder="Zip Code" class="input" />
            </div>
          </div>

          <div class="space-y-3">
            <h4 class="text-sm font-medium text-[#0B1320]">a.7. Permanent address in the Philippines</h4>
            <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
              <input type="text" placeholder="House No." class="input" />
              <input type="text" placeholder="Street" class="input md:col-span-2" />
              <input type="text" placeholder="Barangay" class="input" />
              <input type="text" placeholder="City/Municipality" class="input" />
              <input type="text" placeholder="Province" class="input" />
              <input type="text" placeholder="Zip Code" class="input" />
            </div>
          </div>

          <!-- Civil Status / Citizenship -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-[#0B1320]">a.9. Civil status</label>
              <div class="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <select class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]">
                  <option>Single</option>
                  <option>Married</option>
                  <option>Widowed</option>
                  <option>Others</option>
                </select>
                <input type="text" placeholder="If others, specify" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81] col-span-2 sm:col-span-3" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-[#0B1320]">a.10. Citizenship</label>
              <div class="mt-2 flex flex-wrap items-center gap-4">
                <label class="inline-flex items-center gap-2">
                  <input type="radio" name="cit" class="h-4 w-4" />
                  <span class="text-sm">Filipino</span>
                </label>
                <label class="inline-flex items-center gap-2">
                  <input type="radio" name="cit" class="h-4 w-4" />
                  <span class="text-sm">Dual citizen</span>
                </label>
                <input type="text" placeholder="If dual, indicate details" class="flex-1 min-w-[220px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]" />
              </div>
            </div>
          </div>
        </section>

        <!-- B. FAMILY INFORMATION -->
        <section class="space-y-4">
          <h3 class="text-base font-semibold text-[#0B1320]">B. FAMILY INFORMATION</h3>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium">b.1. Spouse — Last name</label>
              <input type="text" placeholder="Last name" class="mt-2 input" />
            </div>
            <div>
              <label class="block text-sm font-medium">Given name</label>
              <input type="text" placeholder="Given name" class="mt-2 input" />
            </div>
            <div>
              <label class="block text-sm font-medium">Middle name</label>
              <input type="text" placeholder="Middle name" class="mt-2 input" />
            </div>
            <div>
              <label class="block text-sm font-medium">Ext.</label>
              <input type="text" placeholder="Jr., Sr., III" class="mt-2 input" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium">b.2. Citizenship</label>
              <input type="text" placeholder="Citizenship" class="mt-2 input" />
            </div>
          </div>

          <!-- Children 1–10 -->
          <div class="space-y-2">
            <label class="block text-sm font-medium">b.3. Name of children (1–10)</label>
            <div class="space-y-2">
              <template v-for="i in 10" :key="i">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input type="text" :placeholder="`Child ${i} — Last name`" class="input" />
                  <input type="text" placeholder="Given name" class="input" />
                  <input type="text" placeholder="Middle name" class="input" />
                  <input type="text" placeholder="Ext." class="input" />
                </div>
              </template>
            </div>
          </div>

          <!-- Authorized representative 1–3 -->
          <div class="space-y-2">
            <label class="block text-sm font-medium">b.4. Authorized representative (Name, Relationship)</label>
            <div class="space-y-2">
              <template v-for="i in 3" :key="'rep'+i">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input type="text" :placeholder="`b.4.${i} — Name of representative`" class="input" />
                  <input type="text" placeholder="Relationship" class="input" />
                </div>
              </template>
            </div>
          </div>
        </section>

        <!-- C. CONTACT INFORMATION -->
        <section class="space-y-4">
          <h3 class="text-base font-semibold text-[#0B1320]">C. CONTACT INFORMATION</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium">c.1. Contact number — Telephone</label>
              <input type="text" placeholder="e.g., (085) 123 4567" class="mt-2 input" />
            </div>
            <div>
              <label class="block text-sm font-medium">c.1. Contact number — Mobile</label>
              <input type="text" placeholder="e.g., 09XXXXXXXXX" class="mt-2 input" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium">c.2. Email address</label>
            <input type="email" placeholder="Enter your email address" class="mt-2 input" />
          </div>
        </section>

        <!-- D. DESIGNATED BENEFICIARY -->
        <section class="space-y-4">
          <h3 class="text-base font-semibold text-[#0B1320]">D. DESIGNATED BENEFICIARY</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium">d.1. Primary</label>
              <input type="text" placeholder="Name of primary beneficiary" class="input" />
              <input type="text" placeholder="Relationship" class="input" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium">d.2. Contingent</label>
              <input type="text" placeholder="Name of contingent beneficiary" class="input" />
              <input type="text" placeholder="Relationship" class="input" />
            </div>
          </div>
        </section>

        <!-- E. CHECKBOX LIST -->
        <section class="space-y-4">
          <h3 class="text-base font-semibold text-[#0B1320]">E.</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label class="inline-flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-3 py-3">
              <input type="checkbox" class="h-5 w-5" />
              <span class="text-sm">fooe</span>
            </label>
            <label class="inline-flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-3 py-3">
              <input type="checkbox" class="h-5 w-5" />
              <span class="text-sm">medical checkup</span>
            </label>
            <label class="inline-flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-3 py-3">
              <input type="checkbox" class="h-5 w-5" />
              <span class="text-sm">medicine/vitamins</span>
            </label>
            <label class="inline-flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-3 py-3">
              <input type="checkbox" class="h-5 w-5" />
              <span class="text-sm">livelihood entrepreneurial activities</span>
            </label>
          </div>
          <div>
            <input type="text" placeholder="Others: kindly specify"
                   class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]" />
          </div>
        </section>

        <!-- F. OATH -->
        <section class="space-y-4">
          <h3 class="text-base font-semibold text-[#0B1320]">F. OATH</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium">Name and signature/thumbmark of applicant</label>
              <div class="mt-2 h-24 rounded-xl border-2 border-dashed border-slate-300 bg-white"></div>
            </div>
            <div>
              <label class="block text-sm font-medium">Date of application</label>
              <input type="text" placeholder="MM/DD/YYYY" class="mt-2 input" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium">Attorney oath</label>
            <div class="mt-2 h-24 rounded-xl border-2 border-dashed border-slate-300 bg-white"></div>
          </div>
        </section>

        <!-- G. DOCUMENTARY REQUIREMENTS -->
        <section class="space-y-4">
          <h3 class="text-base font-semibold text-[#0B1320]">G. DOCUMENTARY REQUIREMENTS</h3>
          <ul class="list-disc pl-6 text-sm text-slate-700 space-y-1">
            <li>Application form</li>
            <li>Valid ID</li>
            <li>Proof of Residency</li>
            <li>2×2 ID Picture</li>
          </ul>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Empty state uploader -->
            <div>
              <label class="block text-sm font-medium">Upload — Empty state</label>
              <div class="mt-2 flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2">
                <button class="px-3 py-1.5 rounded-md bg-[#0F4C81] text-white text-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F4C81]">Choose File</button>
                <span class="text-sm text-slate-500">No file chosen</span>
              </div>
            </div>
            <!-- With files -->
            <div>
              <label class="block text-sm font-medium">Upload — With files</label>
              <div class="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-2">
                <div class="flex flex-wrap gap-2">
                  <span class="chip">valid_id.pdf <b class="ml-1 text-slate-400">✕</b></span>
                  <span class="chip">residency.jpg <b class="ml-1 text-slate-400">✕</b></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Placeholder sections H–K -->
        <section class="space-y-2">
          <h3 class="text-base font-semibold text-[#0B1320]">H.</h3>
          <div class="h-24 rounded-xl border-2 border-dashed border-slate-300 bg-white"></div>
        </section>
        <section class="space-y-2">
          <h3 class="text-base font-semibold text-[#0B1320]">I.</h3>
          <div class="h-24 rounded-xl border-2 border-dashed border-slate-300 bg-white"></div>
        </section>
        <section class="space-y-2">
          <h3 class="text-base font-semibold text-[#0B1320]">J.</h3>
          <div class="h-24 rounded-xl border-2 border-dashed border-slate-300 bg-white"></div>
        </section>
        <section class="space-y-2">
          <h3 class="text-base font-semibold text-[#0B1320]">K.</h3>
          <div class="h-24 rounded-xl border-2 border-dashed border-slate-300 bg-white"></div>
        </section>

        <!-- Declaration checkbox (to match screenshot style) -->
        <div class="pt-2">
          <label class="inline-flex items-start gap-3">
            <input type="checkbox" class="mt-1.5 h-5 w-5" />
            <span class="text-xs text-slate-700">I declare that all information provided is true and correct.</span>
          </label>
        </div>
      </div>
    </div>
  </main>

  <!-- Sticky Action Bar -->
  <div class="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur border-t border-slate-200">
    <div class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center justify-end">
      <button class="h-12 px-5 rounded-xl border border-slate-300 text-[#0B1320] bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F4C81]">
        Save Draft
      </button>
      <!-- Disabled variant (visual only) -->
      <button disabled class="h-12 px-6 rounded-xl bg-[#0F4C81]/40 text-white cursor-not-allowed">
        Submit
      </button>
    </div>
  </div>
</template>

<script setup>
// design-only; no functionality
</script>

<style scoped>
.input {
  @apply w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81];
}
.chip {
  @apply inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs;
}
</style>
