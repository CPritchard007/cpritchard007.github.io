<script setup>
import { computed, ref, watch } from 'vue'
import { getWikipediaPageUrl, getWikipediaSearchUrl, getWikipediaSummary } from '../utils/wiki'

const props = defineProps({
  text: { type: String, required: true },
  size: { type: String, default: 'small' },
})

const open = ref(false)
const loading = ref(false)
const summary = ref(null)

const href = computed(() => {
  return getWikipediaPageUrl(props.text)
})

function openWikipedia() {
  const direct = getWikipediaPageUrl(props.text)
  const search = getWikipediaSearchUrl(props.text)
  const url = summary.value?.url || direct || search
  window.open(url || search, '_blank', 'noreferrer')
}

async function ensureSummary() {
  if (loading.value || summary.value) return
  loading.value = true
  summary.value = await getWikipediaSummary(props.text)
  loading.value = false
}

watch(
  open,
  (isOpen) => {
    if (isOpen) ensureSummary()
  },
  { flush: 'post' },
)

const tooltipText = computed(() => {
  if (loading.value) return 'Loading Wikipedia…'
  if (summary.value?.extract) return summary.value.extract
  return 'Click to open Wikipedia search'
})
</script>

<template>
  <v-tooltip v-model="open" location="top" max-width="420" content-class="tag-tooltip-shell">
    <template #activator="{ props: actProps }">
      <v-chip v-bind="actProps" :size="size" label class="tag-chip" :title="`Open Wikipedia: ${text}`"
        @click.stop="openWikipedia" @keydown.enter.stop.prevent="openWikipedia"
        @keydown.space.stop.prevent="openWikipedia">
        {{ text }}
      </v-chip>
    </template>
    <v-card class="tag-tooltip-card" variant="elevated" rounded="lg">
      <v-card-title v-if="summary?.title" class="text-subtitle-2 pb-1">
        {{ summary.title }}
      </v-card-title>

      <v-card-text class="tag-tooltip-text text-body-2">
        {{ tooltipText }}
      </v-card-text>

      <v-divider />

      <v-card-actions class="py-1">
        <v-spacer />
        <v-btn size="small" variant="text" color="primary" @click.stop="openWikipedia">
          Open Wikipedia
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-tooltip>
</template>

<style scoped>
.tag-chip {
  cursor: pointer;
}

:deep(.tag-tooltip-shell) {
  background: transparent !important;
  padding: 0 !important;
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
}

:deep(.tag-tooltip-shell::before),
:deep(.tag-tooltip-shell::after) {
  display: none !important;
  content: none !important;
}

.tag-tooltip-card {
  background: rgba(var(--v-theme-surface), 0.94) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border: 1px solid rgba(var(--v-theme-on-background), 0.12);
  margin: 0 !important;
  width: 100%;
}



.tag-tooltip-text {
  line-height: 1.35;
  white-space: normal;
}
</style>
