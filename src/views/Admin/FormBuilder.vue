<template>
  <div class="min-h-screen flex bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-[1.05rem] leading-relaxed">
    <!-- 🟩 Sidebar -->
    <aside class="w-72 bg-emerald-700 text-emerald-50 flex flex-col justify-between p-6 sticky top-0 h-screen shadow-xl text-[1rem]">
      <div>
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow overflow-hidden">
            <img 
              src="/logo.png" 
              alt="OSCA Logo" 
              class="w-8 h-8 object-contain"
            />
          </div>
          <h1 class="text-2xl font-bold tracking-wide text-white">OSCA Admin</h1>
        </div>

        <!-- Navigation -->
        <nav class="space-y-1 font-medium text-[1.05rem]">
          <router-link to="/admin/dashboard" class="block px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition">Dashboard</router-link>
          <router-link to="/admin/programconfig" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">Programs</router-link>
          <router-link to="/admin/formbuilder" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">Application Forms</router-link>
          <router-link to="/admin/usermanagement" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">Users</router-link>
          <router-link to="/admin/complaints" class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-600 transition">Complaints</router-link>
        </nav>
      </div>

      <!-- Footer -->
      <div class="px-4 text-sm text-emerald-200 text-center leading-snug mt-6 border-t border-emerald-600 pt-4">
        © 2025 <span class="font-semibold text-white">SeniorGo</span><br/>
        Made for Butuan Seniors<br/>
        Powered by Barangay &amp; OSCA
      </div>
    </aside>

    <!-- 🟨 Main Content -->
    <main class="flex-1 p-8 flex flex-col items-center overflow-y-auto">
      <!-- HEADER -->
      <div class="w-full max-w-6xl flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-emerald-700">Form Builder</h1>

        <select
          v-model="selectedFormId"
          class="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-white"
        >
          <option disabled value="">Select a Form</option>
          <option v-for="f in forms" :key="f.id" :value="f.id">{{ f.name }}</option>
        </select>
      </div>

      <!-- MAIN CONTENT -->
      <div
        v-if="selectedFormId"
        class="w-full max-w-6xl bg-white border border-emerald-100 rounded-2xl shadow-xl overflow-hidden flex flex-col"
      >
        <!-- TABLE HEADER -->
        <div class="bg-emerald-50 grid grid-cols-7 text-sm font-semibold text-emerald-800 px-4 py-3 border-b border-emerald-100">
          <div class="col-span-1">Order</div>
          <div class="col-span-2">Label</div>
          <div class="col-span-1">Type</div>
          <div class="col-span-1">Required</div>
          <div class="col-span-1">Section</div>
          <div class="col-span-1 text-right">Actions</div>
        </div>

        <!-- FIELD LIST -->
        <div class="flex-1 overflow-y-auto max-h-[65vh] divide-y divide-gray-100">
          <draggable v-model="fields" item-key="id" animation="200">
            <template #item="{ element, index }">
              <div
                class="grid grid-cols-7 items-center text-sm text-gray-700 hover:bg-emerald-50/40 px-4 py-2 transition cursor-grab"
              >
                <div class="col-span-1 font-semibold text-gray-500">#{{ index + 1 }}</div>
                <div class="col-span-2 truncate">{{ element.label }}</div>
                <div class="col-span-1 capitalize">{{ element.type }}</div>
                <div class="col-span-1">
                  <span
                    class="px-2 py-0.5 rounded-full text-xs font-semibold"
                    :class="element.required ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'"
                  >
                    {{ element.required ? 'Yes' : 'No' }}
                  </span>
                </div>
                <div class="col-span-1 text-gray-600">
                  {{ element.section || '-' }}
                </div>
                <div class="col-span-1 text-right flex justify-end gap-2">
                  <button @click="editField(element)" class="text-emerald-600 hover:text-emerald-800">✏️</button>
                  <button @click="deleteField(element.id)" class="text-red-500 hover:text-red-700">🗑️</button>
                </div>
              </div>
            </template>
          </draggable>
        </div>

        <!-- BOTTOM ACTIONS -->
        <div class="flex justify-between items-center px-6 py-4 bg-white border-t border-gray-200">
          <button @click="addField" class="btn-secondary">➕ Add Field</button>
          <button @click="saveChanges" class="btn-primary">💾 Save Changes</button>
        </div>
      </div>

      <div v-else class="text-gray-500 mt-20 text-center">
        Select a form to start editing.
      </div>

      <!-- MODAL -->
      <transition name="slide">
        <div
          v-if="showModal"
          class="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white border-l border-emerald-200 shadow-2xl z-50 flex flex-col"
        >
          <div class="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 class="text-lg font-bold text-emerald-700">
              {{ editingField ? 'Edit Field' : 'Add New Field' }}
            </h2>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700">✖</button>
          </div>

          <div class="flex-1 p-4 space-y-3 overflow-y-auto">
            <input v-model="formField.label" placeholder="Field Label" class="form-input" />
            <select v-model="formField.type" class="form-input">
              <option value="text">Text</option>
              <option value="textarea">Textarea</option>
              <option value="dropdown">Dropdown</option>
              <option value="radio">Radio</option>
              <option value="checkbox">Checkbox</option>
              <option value="date">Date</option>
              <option value="file">File</option>
              <option value="group">Group</option>
            </select>
            <input
              v-model="formField.placeholder"
              placeholder="Placeholder (optional)"
              class="form-input"
            />
            <textarea
              v-model="formField.options"
              placeholder='Options (comma-separated or JSON)'
              class="form-input"
              rows="3"
            ></textarea>
            <input v-model="formField.section" placeholder="Section (senior / osca)" class="form-input" />
            <label class="flex items-center gap-2 text-sm text-gray-700 mt-2">
              <input type="checkbox" v-model="formField.required" />
              <span>Required</span>
            </label>
          </div>

          <div class="p-4 border-t border-gray-200 flex justify-end gap-2">
            <button @click="closeModal" class="btn-secondary">Cancel</button>
            <button @click="saveField" class="btn-primary">{{ editingField ? 'Update' : 'Add' }}</button>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import draggable from 'vuedraggable'
import { supabase } from '@/supabase/client'

const forms = ref<any[]>([])
const fields = ref<any[]>([])
const selectedFormId = ref<number | null>(null)
const formName = computed(() => forms.value.find(f => f.id === selectedFormId.value)?.name || '')

const showModal = ref(false)
const editingField = ref(false)
const formField = reactive({
  id: null as number | null,
  label: '',
  type: 'text',
  placeholder: '',
  options: '',
  section: 'senior',
  required: false,
})

onMounted(async () => {
  const { data, error } = await supabase.from('Forms').select('id, name')
  if (error) console.error(error)
  else forms.value = data
})

watch(selectedFormId, async (id: number | null) => {
  if (!id) return
  const { data, error } = await supabase
    .from('FormFields')
    .select('*')
    .eq('form_id', id)
    .order('order_index')
  if (error) console.error(error)
  else fields.value = data
})

function addField() {
  editingField.value = false
  Object.assign(formField, {
    id: null,
    label: '',
    type: 'text',
    placeholder: '',
    options: '',
    section: 'senior',
    required: false,
  })
  showModal.value = true
}

function editField(field: any) {
  editingField.value = true
  Object.assign(formField, field)
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function saveField() {
  if (editingField.value) {
    const idx = fields.value.findIndex(f => f.id === formField.id)
    if (idx !== -1) fields.value[idx] = { ...formField }
  } else {
    fields.value.push({
      ...formField,
      id: Date.now(),
      form_id: selectedFormId.value,
      order_index: fields.value.length + 1,
    })
  }
  showModal.value = false
}

async function deleteField(id: number) {
  if (!confirm('Delete this field?')) return
  fields.value = fields.value.filter(f => f.id !== id)
  await supabase.from('FormFields').delete().eq('id', id)
}

async function saveChanges() {
  fields.value.forEach((f, i) => (f.order_index = i + 1))
  const { error } = await supabase.from('FormFields').upsert(fields.value)
  if (error) {
    console.error(error)
    alert('❌ Error saving changes!')
  } else {
    alert('✅ Form updated successfully!')
  }
}
</script>

<style scoped>
.form-input {
  @apply w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition;
}
.btn-primary {
  @apply bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition;
}
.btn-secondary {
  @apply border border-gray-300 px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition;
}

/* Side Drawer Animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
