<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <Sidebar role="brgy" />

    <main class="flex-1 p-6 md:ml-60">
      <div class="max-w-4xl mx-auto bg-white border rounded-2xl shadow-md p-6">
        <h1 class="text-2xl font-extrabold text-emerald-700 mb-2">
          Post an Announcement to OSCA or Seniors
        </h1>
        <p class="text-gray-600 mb-6">
          Barangay staff can send official notices to the OSCA Office or senior citizens registered in your barangay.
        </p>

        <form class="space-y-6" @submit.prevent="onSubmit">
          <!-- Title -->
          <div>
            <label class="block font-semibold text-sm text-gray-700 mb-1">Title</label>
            <input v-model.trim="title" type="text" required
              placeholder="Enter announcement title"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"/>
          </div>

          <!-- Message -->
          <div>
            <label class="block font-semibold text-sm text-gray-700 mb-1">Message Content</label>
            <textarea v-model.trim="message" rows="5" required
              placeholder="Write your announcement..."
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none resize-none"></textarea>
          </div>

          <!-- Recipient type -->
          <div>
            <label class="block font-semibold text-sm text-gray-700 mb-2">Recipient (pick one)</label>
            <div class="grid gap-2 md:grid-cols-3">
              <label class="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-emerald-50"
                     :class="recipient==='osca' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'">
                <input type="radio" class="accent-emerald-600" value="osca" v-model="recipient" />
                <span class="font-medium">OSCA Office</span>
              </label>
              <label class="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-emerald-50"
                     :class="recipient==='all_seniors' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'">
                <input type="radio" class="accent-emerald-600" value="all_seniors" v-model="recipient" />
                <span class="font-medium">All Seniors (my barangay)</span>
              </label>
              <label class="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-emerald-50"
                     :class="recipient==='specific_seniors' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'">
                <input type="radio" class="accent-emerald-600" value="specific_seniors" v-model="recipient" />
                <span class="font-medium">Specific Seniors</span>
              </label>
            </div>
          </div>

          <!-- Senior picker -->
          <div v-if="recipient === 'specific_seniors'">
            <label class="block font-semibold text-sm text-gray-700 mb-2">Pick seniors (in your barangay)</label>
            <input v-model="seniorFilter" type="text" placeholder="Search name / RRN / OSCA ID..."
                   class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"/>
            <div class="mt-2 grid md:grid-cols-2 gap-2 max-h-56 overflow-auto pr-1">
              <label v-for="s in filteredSeniors" :key="s.user_id"
                     class="flex items-center gap-2 p-2 border rounded-lg hover:bg-emerald-50 cursor-pointer">
                <input type="checkbox" class="accent-emerald-600" :value="s.user_id" v-model="pickedSeniorUserIds">
                <span class="text-sm">
                  {{ s.full_name || s.user_id }}
                  <span class="block text-xs text-gray-500"
                        v-if="s.rrn || s.osca_id">RRN: {{ s.rrn || '-' }} • OSCA: {{ s.osca_id || '-' }}</span>
                </span>
              </label>
            </div>
            <div v-if="pickedSeniorUserIds.length" class="text-sm text-gray-600 mt-1">
              Selected: {{ pickedSeniorUserIds.length }} senior/s
            </div>
          </div>

          <!-- Attachment -->
          <div>
            <label class="block font-semibold text-sm text-gray-700 mb-1">Attachment (optional)</label>
            <input type="file" @change="handleFileUpload"
              class="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"/>
            <p v-if="fileName" class="text-sm text-gray-600 mt-1">Attached: {{ fileName }}</p>
          </div>

          <!-- Preview -->
          <div v-if="title || message" class="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
            <h3 class="font-semibold text-emerald-700">Preview</h3>
            <p class="mt-2 text-lg font-bold text-gray-800">{{ title }}</p>
            <p class="mt-1 text-gray-700 whitespace-pre-line">{{ message }}</p>
            <p v-if="recipient" class="mt-2 text-sm text-emerald-700">
              Recipient: <strong>{{ recipientLabel }}</strong>
              <span v-if="recipient==='specific_seniors'"> • Picked: <strong>{{ pickedSeniorUserIds.length }}</strong></span>
            </p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3">
            <button type="button" @click="clearForm" class="px-5 py-2 border rounded-lg hover:bg-gray-100">Clear</button>
            <button :disabled="submitting" type="submit"
              class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
              <span v-if="!submitting">Send Announcement</span>
              <span v-else>Sending…</span>
            </button>
          </div>
        </form>

        <p class="text-xs text-gray-500 mt-4">
          Notes: “All seniors” resolves seniors in your barangay. “OSCA Office” resolves all OSCA staff users.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { supabase } from '@/supabase/client'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()

// form state
const title = ref('')
const message = ref('')
const recipient = ref('') // 'osca' | 'all_seniors' | 'specific_seniors'
const fileObj = ref(null)
const fileName = ref('')
const submitting = ref(false)

// my barangay + seniors there
const myBarangayId = ref(null)
const seniors = ref([])
const seniorFilter = ref('')
const pickedSeniorUserIds = ref([])

const recipientLabel = computed(() =>
  recipient.value === 'osca' ? 'OSCA Office'
  : recipient.value === 'all_seniors' ? 'All Seniors in My Barangay'
  : recipient.value === 'specific_seniors' ? 'Specific Seniors'
  : '-'
)

const filteredSeniors = computed(() => {
  const q = seniorFilter.value.trim().toLowerCase()
  if (!q) return seniors.value
  return seniors.value.filter(s =>
    (s.full_name || '').toLowerCase().includes(q) ||
    (s.rrn || '').toLowerCase().includes(q) ||
    (s.osca_id || '').toLowerCase().includes(q)
  )
})

function handleFileUpload(e) {
  const f = e.target.files?.[0]
  if (f) { fileObj.value = f; fileName.value = f.name }
  else { fileObj.value = null; fileName.value = '' }
}

function clearForm() {
  title.value = ''
  message.value = ''
  recipient.value = ''
  fileObj.value = null
  fileName.value = ''
  pickedSeniorUserIds.value = []
  seniorFilter.value = ''
}

// ---- load helpers ----

// find the barangay of the current barangay staff via their active membership
async function resolveMyBarangayId() {
  // Organizations.kind='barangay' and Memberships.user_id = auth.uid(), status='active'
  const { data: mems, error } = await supabase
    .from('Memberships')
    .select('organization_id, status, Organizations!inner(id, kind, barangay_id)')
    .eq('user_id', user.value.id)
    .eq('status', 'active')
  if (!error) {
    const hit = (mems ?? []).find(m => m.Organizations?.kind === 'barangay')
    myBarangayId.value = hit?.Organizations?.barangay_id ?? null
  }
}

// seniors limited to my barangay (RLS allows this)
async function loadSeniorsInMyBarangay() {
  if (!myBarangayId.value) return
  const { data, error } = await supabase
    .from('SeniorCitizens')
    .select('user_id, osca_id, rrn, full_name, barangay_id')
    .eq('barangay_id', myBarangayId.value)
  if (!error) seniors.value = data ?? []
}

// resolve all OSCA staff users
async function loadOscaStaffUserIds() {
  const { data, error } = await supabase
    .from('Memberships')
    .select('user_id, Roles!inner(code)')
    .eq('Roles.code', 'osca_staff')
  if (error) throw error
  return (data ?? []).map(r => r.user_id)
}

async function uploadAttachmentIfAny() {
  if (!fileObj.value) return { url: null, path: null }
  const f = fileObj.value
  const path = `announcements/${Date.now()}_${Math.random().toString(36).slice(2)}_${f.name}`
  const { error: upErr } = await supabase.storage.from('announcements').upload(path, f, {
    cacheControl: '3600',
    upsert: false
  })
  if (upErr) throw upErr
  const { data } = supabase.storage.from('announcements').getPublicUrl(path)
  return { url: data?.publicUrl ?? null, path }
}

// ---- submit ----
async function onSubmit() {
  if (!title.value || !message.value || !recipient.value) {
    alert('Please complete Title, Message, and Recipient.')
    return
  }
  if (recipient.value === 'specific_seniors' && pickedSeniorUserIds.value.length === 0) {
    alert('Pick at least one senior or change Recipient.')
    return
  }
  if (recipient.value !== 'osca' && !myBarangayId.value) {
    alert('Could not determine your barangay. Please re-login or contact admin.')
    return
  }

  submitting.value = true
  try {
    const { url: attachment_url } = await uploadAttachmentIfAny()

    // Decide target_type + recipients
    let target_type = 'group'     // default we’ll use 'group' for “my barangay”
    let target_id = null
    let target_user_id = null
    let recipientIds = []

    if (recipient.value === 'osca') {
      // Post one announcement; fanout to all OSCA staff users
      target_type = 'group'       // any type is fine; OSCA can read all per policy
      target_id = null
      recipientIds = await loadOscaStaffUserIds()
    }

    if (recipient.value === 'all_seniors') {
      target_type = 'group'
      target_id = myBarangayId.value   // mark which barangay
      // seniors in my barangay
      const { data, error } = await supabase
        .from('SeniorCitizens')
        .select('user_id')
        .eq('barangay_id', myBarangayId.value)
      if (error) throw error
      recipientIds = (data ?? []).map(r => r.user_id)
    }

    if (recipient.value === 'specific_seniors') {
      target_type = 'individual'   // message conceptually to individuals
      target_id = null
      recipientIds = [...pickedSeniorUserIds.value]
    }

    // Insert announcement
    const { data: inserted, error: insErr } = await supabase
      .from('Announcements')
      .insert([{
        sender_user_id: user.value.id,
        sender_role: 'brgy_staff',
        target_type,
        target_id,
        target_user_id,   // null unless you choose to make per-user rows
        title: title.value,
        content: message.value,
        attachment_url: attachment_url ?? null
      }])
      .select('id')
      .single()

    if (insErr) throw insErr
    const announcementId = inserted.id

    // Fan-out notifications (chunked)
    recipientIds = Array.from(new Set(recipientIds))
    const chunkSize = 500
    for (let i = 0; i < recipientIds.length; i += chunkSize) {
      const slice = recipientIds.slice(i, i + chunkSize)
      if (!slice.length) continue
      const rows = slice.map(uid => ({ user_id: uid, announcement_id: announcementId }))
      const { error: notifErr } = await supabase.from('Notifications').insert(rows)
      if (notifErr) throw notifErr
    }

    alert('Announcement sent successfully.')
    clearForm()
  } catch (err) {
    console.error(err)
    alert('Sorry, something went wrong sending the announcement. Please try again.')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await resolveMyBarangayId()
  await loadSeniorsInMyBarangay()
})
</script>
