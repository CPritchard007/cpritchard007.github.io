<script setup>
import { projects } from '../data/projects'
import { useRouter } from 'vue-router'
import { renderMarkdown } from '../utils/markdown'
import TagChip from '../components/TagChip.vue'

const router = useRouter()
function viewCompanyProjects() {
  router.push({ name: 'work-experience' })
}
</script>

<template>
  <v-container class="page">
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="section-title">Personal Projects</h1>
      </div>
      <v-btn variant="tonal" prepend-icon="mdi-github" href="https://github.com/cpritchard007" target="_blank"
        rel="noreferrer">
        GitHub
      </v-btn>
    </div>

    <v-divider class="mb-6" />

    <div v-if="projects.length === 0">
      <p class=" text-center">No personal projects listed yet, but more are on the way!
        <button class="text-primary" @click="viewCompanyProjects">View Work Projects</button>
      </p>
    </div>
    <v-row dense>
      <v-col v-for="p in projects" :key="p.title" cols="12" md="6">
        <v-card class="project-card" rounded="xl" elevation="0">
          <v-card-title class="d-flex align-center justify-space-between">
            <span>{{ p.title }}</span>
          </v-card-title>
          <v-card-text class="lead">
            <div class="markdown" v-html="renderMarkdown(p.description)" />
          </v-card-text>
          <v-card-text class="chip-row">
            <TagChip v-for="t in p.tags" :key="t" :text="t" />
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-btn v-if="p.links?.demo" color="primary" variant="flat" prepend-icon="mdi-open-in-new"
              :href="p.links.demo" target="_blank" rel="noreferrer">
              Demo
            </v-btn>
            <v-btn v-if="p.links?.repo" variant="tonal" prepend-icon="mdi-source-repository" :href="p.links.repo"
              target="_blank" rel="noreferrer">
              Repo
            </v-btn>
            <v-spacer />
            <div>
              <v-img src="https://picsum.photos/40/40" width="40" height="40" rounded="sm" />
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.project-card {
  background: rgba(var(--v-theme-surface), 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.markdown :deep(p) {
  margin: 0 0 0.75rem;
}

.markdown :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown :deep(ul),
.markdown :deep(ol) {
  margin: 0.25rem 0 0.75rem 1.25rem;
}
</style>
