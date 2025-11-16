<template>
  <div class="relative w-full">
    <input
      type="text"
      v-model="query"
      @input="onInput"
      @focus="open = true"
      @keydown.down.prevent="highlightNext"
      @keydown.up.prevent="highlightPrev"
      @keydown.enter.prevent="selectHighlighted"
      class="w-full rounded-xl border px-4 py-2
             bg-white text-emerald-900 placeholder:text-emerald-600
             ring-1 ring-emerald-200 focus:ring-2 focus:ring-yellow-300
             outline-none"
      placeholder="Search..."
    />

    <!-- AUTOSUGGEST DROPDOWN -->
    <ul
      v-if="open && filteredResults.length"
      class="absolute z-50 bg-white border w-full mt-1 rounded-xl shadow-lg max-h-60 overflow-y-auto"
    >
      <li
        v-for="(item, i) in filteredResults"
        :key="i"
        @click="select(item)"
        :class="[
          'px-4 py-2 cursor-pointer text-emerald-900',
          highlightedIndex === i
            ? 'bg-emerald-600 text-white'
            : 'hover:bg-emerald-100'
        ]"
      >
        {{ item[labelKey] }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  items: { type: Array, required: true },
  labelKey: { type: String, default: "label" },
});

const emit = defineEmits(["select"]);

const query = ref("");
const open = ref(false);
const highlightedIndex = ref(-1);

const filteredResults = computed(() => {
  if (!query.value) return [];
  return props.items.filter((item) =>
    item[props.labelKey].toLowerCase().includes(query.value.toLowerCase())
  );
});

const onInput = () => {
  open.value = true;
  highlightedIndex.value = -1;
};

const select = (item) => {
  emit("select", item);
  query.value = item[props.labelKey];
  open.value = false;
};

const highlightNext = () => {
  if (highlightedIndex.value < filteredResults.value.length - 1) {
    highlightedIndex.value++;
  }
};

const highlightPrev = () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--;
  }
};

const selectHighlighted = () => {
  if (filteredResults.value[highlightedIndex.value]) {
    select(filteredResults.value[highlightedIndex.value]);
  }
};

watch(query, () => {
  if (!query.value) open.value = false;
});
</script>
