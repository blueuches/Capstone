<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <Sidebar role="osca" />

    <main class="flex-1 p-6 md:ml-60">
      <div class="max-w-4xl mx-auto bg-white border rounded-2xl shadow-md p-6">
        <h1 class="text-2xl font-extrabold text-emerald-700 mb-2">Post an Announcement</h1>
        <p class="text-gray-600 mb-6">
          Send important updates to Senior Citizens or Barangay Personnel. You can post citywide or to selected barangays.
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
              placeholder="Write your announcement…"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none resize-none"></textarea>
          </div>

          <!-- Audience -->
          <div>
            <label class="block font-semibold text-sm text-gray-700 mb-2">Audience (pick one)</label>
            <div class="grid gap-2 md:grid-cols-2">
              <label class="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-emerald-50"
                     :class="audience==='seniors' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'">
                <input type="radio" class="accent-emerald-600" value="seniors" v-model="audience" />
                <span class="font-medium">Senior Citizens</span>
              </label>
              <label class="flex items-center gap-2 p-3 rounded-lg border cursor-pointer hover:bg-emerald-50"
                     :class="audience==='barangay' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'">
                <input type="radio" class="accent-emerald-600" value="barangay" v-model="audience" />
                <span class="font-medium">Barangay Personnel</span>
              </label>
            </div>
          </div>

          <!-- Scope (works the same for seniors or barangay personnel) -->
          <div v-if="audience">
            <label class="block font-semibold text-sm text-gray-700 mb-2">Scope</label>

            <div class="space-y-3">
              <label class="flex items-center gap-2">
                <input type="radio" class="accent-emerald-600" value="all" v-model="scope" />
                <span>Citywide (all)</span>
              </label>

              <label class="flex items-center gap-2">
                <input type="radio" class="accent-emerald-600" value="barangays" v-model="scope" />
                <span>Selected Barangays</span>
              </label>

              <div v-if="scope==='barangays'">
                <div class="mt-2">
                  <input v-model="barangayFilter" type="text" placeholder="Filter barangays…"
                         class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"/>
                </div>
                <div class="mt-2 grid md:grid-cols-2 gap-2 max-h-56 overflow-auto pr-1">
                  <label v-for="b in filteredBarangays" :key="b.id"
                         class="flex items-center gap-2 p-2 border rounded-lg hover:bg-emerald-50 cursor-pointer">
                    <input type="checkbox" class="accent-emerald-600" :value="b.id" v-model="pickedBarangayIds">
                    <span>{{ b.name }}</span>
                  </label>
                </div>
                <div v-if="pickedBarangayIds.length" class="text-sm text-gray-600">
                  Selected: {{ pickedBarangayIds.length }} barangay/ays
                </div>
              </div>
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
            <p v-if="audience" class="mt-2 text-sm text-emerald-700">
              Audience: <strong>{{ audienceLabel }}</strong> • Scope: <strong>{{ scopeLabel }}</strong>
            </p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3">
            <button type="button" @click="clearForm" class="px-5 py-2 border rounded-lg hover:bg-gray-100">Clear</button>
            <button :disabled="submitting" type="submit"
              class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
              <span v-if="!submitting">Post Announcement</span>
              <span v-else>Posting…</span>
            </button>
          </div>
        </form>

        <p class="text-xs text-gray-500 mt-4">
          Note: For selected barangays, recipients are auto-resolved based on barangay mapping.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabase/client'
import Sidebar from '@/components/Sidebar.vue'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()

// Form state
const title = ref('')
const message = ref('')
const audience = ref('')          // 'seniors' | 'barangay'
const scope = ref('all')          // 'all' | 'barangays'
const fileObj = ref(null)
const fileName = ref('')

// Barangays
const barangays = ref([])
const barangayFilter = ref('')
const pickedBarangayIds = ref([])

const submitting = ref(false)

// Labels for preview
const audienceLabel = computed(() =>
  audience.value === 'seniors' ? 'Senior Citizens'
  : audience.value === 'barangay' ? 'Barangay Personnel' : '-'
)
const scopeLabel = computed(() =>
  scope.value === 'all'
    ? 'Citywide'
    : `Selected Barangays (${pickedBarangayIds.value.length})`
)

const filteredBarangays = computed(() => {
  const q = barangayFilter.value.trim().toLowerCase()
  if (!q) return barangays.value
  return barangays.value.filter(b => b.name.toLowerCase().includes(q))
})

function handleFileUpload(e) {
  const f = e.target.files?.[0]
  if (f) { fileObj.value = f; fileName.value = f.name }
  else { fileObj.value = null; fileName.value = '' }
}

function clearForm() {
  title.value = ''
  message.value = ''
  audience.value = ''
  scope.value = 'all'
  fileObj.value = null
  fileName.value = ''
  pickedBarangayIds.value = []
  barangayFilter.value = ''
}

async function loadBarangays() {
  const { data, error } = await supabase.from('Barangays').select('id, name').order('name')
  if (!error) barangays.value = data ?? []
}

async function uploadAttachmentIfAny() {
  if (!fileObj.value) return { url: null, path: null }
  const file = fileObj.value
  const path = `announcements/${Date.now()}_${Math.random().toString(36).slice(2)}_${file.name}`
  const { error: upErr } = await supabase.storage.from('announcements').upload(path, file, {
    cacheControl: '3600',
    upsert: false
  })
  if (upErr) throw upErr
  const { data } = supabase.storage.from('announcements').getPublicUrl(path)
  return { url: data?.publicUrl ?? null, path }
}

/**
 * Send announcement
 * - Insert 1..N Announcements depending on (audience, scope)
 * - Resolve recipients and insert Notifications
 *   Seniors (citywide): all SeniorCitizens.user_id
 *   Seniors (selected brgys): SeniorCitizens where barangay_id IN picked
 *   Barangay Personnel (citywide): Memberships with Roles.code='brgy_staff'
 *   Barangay Personnel (selected brgys): staff in Organizations mapped to those barangays (role brgy_staff)
 */
async function onSubmit() {
  if (!title.value || !message.value || !audience.value) {
    alert('Please complete Title, Message, and Audience.')
    return
  }
  if (scope.value === 'barangays' && pickedBarangayIds.value.length === 0) {
    alert('Select at least one barangay (or choose Citywide).')
    return
  }

  submitting.value = true
  try {
    const { url: attachment_url } = await uploadAttachmentIfAny()

    const batches = []
    if (scope.value === 'all') {
      // single batch (citywide)
      batches.push({
        target_type: audience.value === 'seniors' ? 'all_seniors' : 'all_barangays'
      })
    } else {
      // one batch per barangay (selected)
      for (const bid of pickedBarangayIds.value) {
        batches.push({
          target_type: 'group',
          target_id: bid,
          group_for: audience.value  // 'seniors' or 'barangay'
        })
      }
    }

    for (const b of batches) {
      const { data: inserted, error: insErr } = await supabase
        .from('Announcements')
        .insert([{
          sender_user_id: user.value.id,
          sender_role: 'osca_staff',
          target_type: b.target_type,           // 'all_seniors' | 'all_barangays' | 'group'
          target_id: b.target_id ?? null,       // barangay_id if group
          title: title.value,
          content: message.value,
          attachment_url: attachment_url ?? null
        }])
        .select('id')
        .single()
      if (insErr) throw insErr
      const announcementId = inserted.id

      // Resolve recipients by batch
      let recipientIds = []

      if (b.target_type === 'all_seniors') {
        const { data, error } = await supabase
          .from('SeniorCitizens')
          .select('user_id')
        if (error) throw error
        recipientIds = (data ?? []).map(r => r.user_id)
      }

      if (b.target_type === 'all_barangays') {
        const { data, error } = await supabase
          .from('Memberships')
          .select('user_id, Roles!inner(code)')
          .eq('Roles.code', 'brgy_staff')
        if (error) throw error
        recipientIds = (data ?? []).map(r => r.user_id)
      }

      if (b.target_type === 'group') {
        if (b.group_for === 'seniors') {
          // seniors within this barangay
          const { data, error } = await supabase
            .from('SeniorCitizens')
            .select('user_id')
            .eq('barangay_id', b.target_id)
          if (error) throw error
          recipientIds = (data ?? []).map(r => r.user_id)
        } else {
          // barangay personnel within this barangay
          const { data: orgs, error: orgErr } = await supabase
            .from('Organizations')
            .select('id')
            .eq('barangay_id', b.target_id)
          if (orgErr) throw orgErr
          const orgIds = (orgs ?? []).map(o => o.id)
          if (orgIds.length) {
            const { data: mems, error: memErr } = await supabase
              .from('Memberships')
              .select('user_id, role_id, Roles!inner(code)')
              .in('organization_id', orgIds)
              .eq('Roles.code', 'brgy_staff')
            if (memErr) throw memErr
            recipientIds = (mems ?? []).map(m => m.user_id)
          }
        }
      }

      // insert notifications (chunked)
      recipientIds = Array.from(new Set(recipientIds))
      const chunkSize = 500
      for (let i = 0; i < recipientIds.length; i += chunkSize) {
        const slice = recipientIds.slice(i, i + chunkSize)
        if (!slice.length) continue
        const rows = slice.map(uid => ({ user_id: uid, announcement_id: announcementId }))
        const { error: notifErr } = await supabase.from('Notifications').insert(rows)
        if (notifErr) throw notifErr
      }
    }

    alert('Announcement posted successfully.')
    clearForm()
  } catch (err) {
    console.error(err)
    alert('Sorry, something went wrong posting the announcement. Please try again.')
  } finally {
    submitting.value = false
  }
}

onMounted(loadBarangays)
</script>
