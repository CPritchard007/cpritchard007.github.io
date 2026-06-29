<script setup>
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import defaultResumePdf from '../assets/documents/curtis-pritchard-resume-2026.pdf'

const props = defineProps({
  documentName: {
    type: String,
    default: '',
  },
  documentUrl: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'PDF Viewer',
  },
  description: {
    type: String,
    default: 'Read the document directly in the portfolio.',
  },
})

const page = ref(1)
const zoom = ref(110)
const fileStatus = ref('loading')
const { mdAndDown } = useDisplay()

const normalizedDocumentName = computed(() => props.documentName.replace(/^\/+/, ''))
const baseUrl = new URL(import.meta.env.BASE_URL, window.location.origin)
const resolvedPdfUrl = computed(() => {
  if (props.documentUrl) {
    return props.documentUrl
  }

  if (normalizedDocumentName.value) {
    return new URL(normalizedDocumentName.value, baseUrl).toString()
  }

  return defaultResumePdf
})
const encodedDownloadName = computed(() => {
  if (normalizedDocumentName.value) {
    return normalizedDocumentName.value.split('/').pop() ?? 'document.pdf'
  }

  return props.documentUrl.split('/').pop() || defaultResumePdf.split('/').pop() || 'document.pdf'
})
const viewerSrc = computed(() => (
  `${resolvedPdfUrl.value}#toolbar=0&navpanes=0&scrollbar=1&page=${page.value}&zoom=${zoom.value}`
))
const viewerKey = computed(() => `${normalizedDocumentName.value}-${page.value}-${zoom.value}`)
const zoomLabel = computed(() => `${zoom.value}%`)

function nextPage() {
  page.value += 1
}

function previousPage() {
  page.value = Math.max(1, page.value - 1)
}

function zoomIn() {
  zoom.value = Math.min(200, zoom.value + 10)
}

function zoomOut() {
  zoom.value = Math.max(50, zoom.value - 10)
}

function resetView() {
  page.value = 1
  zoom.value = 110
}

async function checkDocument() {
  fileStatus.value = 'loading'

  try {
    const response = await fetch(resolvedPdfUrl.value, { method: 'HEAD' })

    if (response.ok) {
      fileStatus.value = 'ready'
      return
    }

    fileStatus.value = response.status === 404 ? 'missing' : 'ready'
  } catch {
    fileStatus.value = 'ready'
  }
}

watch(
  () => [props.documentName, props.documentUrl],
  () => {
    resetView()
    checkDocument()
  },
  { immediate: true },
)

watch(page, (value) => {
  if (!Number.isFinite(value) || value < 1) {
    page.value = 1
    return
  }

  page.value = Math.floor(value)
})
</script>

<template>
  <v-container class="page">
    <div class="d-flex align-start justify-space-between flex-wrap ga-4 mb-6">
      <div>
        <div class="kicker">Document Viewer</div>
        <h1 class="section-title mt-2 mb-2">{{ title }}</h1>
        <p class="lead mb-0">{{ description }}</p>
      </div>

      <div class="viewer-actions">
        <v-btn
          variant="tonal"
          prepend-icon="mdi-open-in-new"
          :href="resolvedPdfUrl"
          target="_blank"
          rel="noreferrer"
        >
          Open
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-download"
          :href="resolvedPdfUrl"
          :download="encodedDownloadName"
        >
          Download
        </v-btn>
      </div>
    </div>

    <v-card class="viewer-card" rounded="xl" elevation="0">
      <v-card-text v-if="!mdAndDown" class="toolbar">
        <div class="toolbar-group">
          <v-btn icon="mdi-minus" variant="text" :disabled="zoom <= 50" @click="zoomOut" />
          <v-chip variant="tonal" size="small">{{ zoomLabel }}</v-chip>
          <v-btn icon="mdi-plus" variant="text" :disabled="zoom >= 200" @click="zoomIn" />
        </div>

        <div class="toolbar-group">
          <v-btn icon="mdi-chevron-left" variant="text" :disabled="page <= 1" @click="previousPage" />
          <v-text-field
            v-model.number="page"
            class="page-input"
            density="compact"
            hide-details
            label="Page"
            min="1"
            type="number"
            variant="outlined"
          />
          <v-btn icon="mdi-chevron-right" variant="text" @click="nextPage" />
        </div>

        <v-btn variant="text" prepend-icon="mdi-refresh" @click="resetView">Reset view</v-btn>
      </v-card-text>

      <v-divider />

      <div v-if="fileStatus === 'loading'" class="viewer-state">
        <v-progress-circular indeterminate color="primary" />
        <p class="lead mb-0">Checking document availability...</p>
      </div>

      <div v-else-if="fileStatus === 'missing'" class="viewer-state">
        <v-icon icon="mdi-file-alert-outline" size="40" color="warning" />
        <h2 class="text-h6 mb-2">PDF not found</h2>
        <p class="lead mb-0">
          The configured document could not be loaded. Add <code>public/{{ normalizedDocumentName }}</code> or open this route with a different file via
          <code>/#/pdf-viewer?file=your-document.pdf</code>.
        </p>
      </div>

      <div v-else-if="mdAndDown" class="viewer-state">
        <v-icon icon="mdi-monitor-off" size="40" color="primary" />
        <h2 class="text-h6 mb-2">This preview is desktop only</h2>
        <p class="lead mb-0">On mobile and tablet, use the buttons above to open or download the PDF.</p>
      </div>

      <div v-else class="viewer-shell">
        <iframe
          :key="viewerKey"
          class="viewer-frame"
          :src="viewerSrc"
          :title="`${title} PDF viewer`"
        />
      </div>
    </v-card>
  </v-container>
</template>

<style lang="scss" scoped>
.viewer-card {
  overflow: hidden;
  background: rgba(var(--v-theme-surface), 0.78);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.viewer-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.page-input {
  width: 92px;
}

.viewer-state {
  min-height: 60vh;
  padding: 32px;
  display: grid;
  place-items: center;
  gap: 12px;
  text-align: center;
}

.viewer-shell {
  padding: 12px;
  background:
    radial-gradient(circle at top, rgba(var(--v-theme-primary), 0.09), transparent 42%),
    rgba(15, 23, 42, 0.14);
}

.viewer-frame {
  width: 100%;
  min-height: 78vh;
  border: 0;
  border-radius: 18px;
  background: white;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.22);
}

code {
  font-family: inherit;
  font-weight: 700;
}

@media (max-width: 700px) {
  .toolbar {
    align-items: stretch;
  }

  .toolbar-group,
  .viewer-actions {
    width: 100%;
    justify-content: space-between;
  }

  .viewer-frame {
    min-height: 68vh;
  }
}
</style>
