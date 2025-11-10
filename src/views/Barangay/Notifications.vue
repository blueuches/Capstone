<template>
  <div class="min-h-screen flex bg-gradient-to-br from-green-100 via-emerald-50 to-white">
    <!-- Sidebar -->
    <Sidebar role="brgy" />

    <!-- Main Content -->
    <main class="flex-1 flex flex-col items-center px-6 py-8 md:ml-60">
      <!-- Header -->
      <div class="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-6 mb-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-extrabold text-emerald-700">Barangay Notifications</h1>
            <p class="text-gray-600 mt-1">Updates from OSCA and the system</p>
          </div>

          <button
            class="text-sm px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 disabled:opacity-50"
            @click="markAllRead"
            :disabled="loading || !notifications.length"
          >
            Mark all as read
          </button>
        </div>

        <!-- Optional search -->
        <div class="mt-4">
          <label class="relative block">
            <span class="sr-only">Search</span>
            <svg class="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-emerald-900/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle><path d="m21 21-3.5-3.5"></path>
            </svg>
            <input
              v-model="q"
              type="search"
              placeholder="Search title or content"
              class="w-full rounded-xl pl-10 pr-3 py-2 text-[15px] placeholder:opacity-70
                     bg-white/95 text-emerald-950 ring-1 ring-emerald-200 focus:ring-2 focus:ring-yellow-300 outline-none"
            />
          </label>
        </div>
      </div>

      <!-- List -->
      <div class="w-full max-w-3xl">
        <div v-if="loading" class="space-y-3">
          <div class="h-16 bg-emerald-100/40 animate-pulse rounded-xl"></div>
          <div class="h-16 bg-emerald-100/40 animate-pulse rounded-xl"></div>
        </div>

        <p v-else-if="error" class="text-sm text-red-600">{{ error }}</p>

        <p v-else-if="!filtered.length" class="text-sm text-gray-600">
          You have no notifications yet.
        </p>

        <ul v-else class="space-y-3">
          <li
            v-for="n in filtered"
            :key="n.id"
            class="p-4 rounded-lg border-l-4"
            :class="[n.is_read ? 'bg-white border-emerald-300' : 'bg-emerald-50 border-emerald-500']"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="font-semibold text-emerald-900 line-clamp-1">
                  {{ n.announcement?.title ?? 'Announcement' }}
                </div>

                <div class="text-[15px] text-emerald-800 whitespace-pre-line mt-0.5">
                  {{ n.announcement?.content ?? '' }}
                </div>

                <div v-if="n.announcement?.attachment_url" class="mt-2">
                  <a
                    class="inline-flex items-center text-sm text-emerald-700 underline hover:text-emerald-900"
                    :href="n.announcement.attachment_url" target="_blank" rel="noopener"
                  >
                    View attachment
                    <svg class="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </a>
                </div>

                <div class="text-xs text-gray-500 mt-1">
                  {{ formatTimeAgo(n.created_at) }}
                  <span v-if="n.announcement?.sender_role" class="text-gray-400">
                    • from {{ n.announcement?.sender_role }}
                  </span>
                </div>
              </div>

              <button
                v-if="!n.is_read"
                class="text-xs px-2 py-1 shrink-0 rounded-lg border border-emerald-300 hover:bg-emerald-100"
                @click="markOneRead(n.id)"
              >
                Mark read
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Back -->
      <div class="mt-10">
        <RouterLink to="/barangay/dashboard" class="text-emerald-700 font-bold underline text-lg">
          ← Back to Dashboard
        </RouterLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { useNotifications } from '@/composables/useNotifications'

defineOptions({ name: 'BarangayNotifications' })

/** --- Types to satisfy TS --- */
type Ann = {
  id: number
  title: string | null
  content: string | null
  attachment_url?: string | null
  sender_role?: string | null
}
type Notif = {
  id: number
  is_read: boolean
  created_at: string
  announcement?: Ann | null
}

/** Pull notifications (same composable as senior page) */
const { notifications, unreadCount, loading, error, formatTimeAgo, markOneRead, markAllRead } =
  useNotifications(100)

/** Cast to a typed array so TS recognizes `attachment_url` */
const items = computed<Notif[]>(() => notifications.value as unknown as Notif[])

/** Optional search */
const q = ref('')
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return items.value
  return items.value.filter(n =>
    (n.announcement?.title || '').toLowerCase().includes(term) ||
    (n.announcement?.content || '').toLowerCase().includes(term)
  )
})

/** If you need a bell badge somewhere else, call useNotifications() there
 * instead of trying to `export` from <script setup>.
 * Example in your navbar: const { unreadCount } = useNotifications(10)
 */
</script>


<style scoped>
.line-clamp-1 { display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden; }
</style>
