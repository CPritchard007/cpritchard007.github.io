<script setup>
import { computed, ref, watch } from 'vue'
import { getDefaultIconBackground } from '../utils/siteMetadata'

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  srcs: {
    type: Array,
    default: () => [],
  },
  background: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  size: {
    type: [Number, String],
    default: 32,
  },
  padded: {
    type: Boolean,
    default: false,
  },
})

const failedIndex = ref(0)

const candidates = computed(() => {
  const values = [...props.srcs, props.src]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)

  return [...new Set(values)]
})

const currentSrc = computed(() => candidates.value[failedIndex.value] || '')
const backgroundColor = computed(() => props.background || getDefaultIconBackground())
const dimension = computed(() => `${Number(props.size) || 32}px`)

watch(
  () => [props.src, ...props.srcs],
  () => {
    failedIndex.value = 0
  },
)

function onError() {
  failedIndex.value += 1
}
</script>

<template>
  <span
    class="site-icon"
    :class="{ 'site-icon--padded': padded && currentSrc }"
    :style="{
      width: dimension,
      height: dimension,
      backgroundColor,
    }"
    aria-hidden="true"
  >
    <img
      v-if="currentSrc"
      :src="currentSrc"
      :alt="alt"
      class="site-icon-image"
      @error="onError"
    >
  </span>
</template>

<style scoped lang="scss">
.site-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 22%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}

.site-icon-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.site-icon--padded .site-icon-image {
  width: 72%;
  height: 72%;
  object-fit: contain;
}
</style>
