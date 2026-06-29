<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import TagChip from '../components/TagChip.vue'
import { projects } from '../data/projects'
import { renderMarkdown } from '../utils/markdown'

const router = useRouter()

const githubUsername = import.meta.env.VITE_GITHUB_USERNAME ?? 'cpritchard007'
const githubProjectTopic = (import.meta.env.VITE_GITHUB_PROJECT_TOPIC ?? 'project').toLowerCase()
const githubProfileUrl = `https://github.com/${githubUsername}`
const featuredProjects = projects

const githubRepos = ref([])
const isLoadingRepos = ref(true)
const repoError = ref('')

const hasFeaturedProjects = computed(() => featuredProjects.length > 0)
const hasGithubRepos = computed(() => githubRepos.value.length > 0)

function viewCompanyProjects() {
  router.push({ name: 'work-experience' })
}

function formatRepoUpdatedAt(value) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function formatRepoCreatedAt(value) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function getGithubPagesUrl(repo) {
  if (!repo.has_pages) return ''

  if (repo.homepage) {
    return repo.homepage
  }

  const owner = repo.owner?.login ?? githubUsername
  const normalizedRepoName = repo.name.toLowerCase()
  const userPagesRepoName = `${owner.toLowerCase()}.github.io`

  if (normalizedRepoName === userPagesRepoName) {
    return `https://${owner}.github.io/`
  }

  return `https://${owner}.github.io/${repo.name}/`
}

async function loadGithubRepos() {
  isLoadingRepos.value = true
  repoError.value = ''

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(githubUsername)}/repos?sort=updated&per_page=100&type=owner`,
    )

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`)
    }

    const repos = await response.json()

    const reposWithTopics = await Promise.all(
      repos
        .filter((repo) => !repo.fork && !repo.private)
        .map(async (repo) => {
          const topicsResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/topics`, {
            headers: {
              Accept: 'application/vnd.github+json',
            },
          })

          if (!topicsResponse.ok) {
            throw new Error(`GitHub topics API returned ${topicsResponse.status} for ${repo.full_name}`)
          }

          const topicData = await topicsResponse.json()

          return {
            repo,
            topics: topicData.names ?? [],
          }
        }),
    )

    githubRepos.value = reposWithTopics
      .filter(({ topics }) => topics.some((topic) => topic.toLowerCase() === githubProjectTopic))
      .map(({ repo, topics }) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description?.trim() || 'No description added yet.',
        homepage: repo.homepage?.trim() || '',
        htmlUrl: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        archived: repo.archived,
        hasPages: repo.has_pages,
        pagesUrl: getGithubPagesUrl(repo),
        topics,
      }))
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
  } catch (error) {
    console.error('Failed to load GitHub repositories.', error)
    repoError.value = 'GitHub repos could not be loaded right now.'
  } finally {
    isLoadingRepos.value = false
  }
}

onMounted(() => {
  loadGithubRepos()
})
</script>

<template>
  <v-container class="page">
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <div class="kicker">Projects</div>
        <p class="lead header-copy mt-2 mb-0">
          Featured work lives here, and the rest comes from public GitHub repositories tagged
          <strong>{{ githubProjectTopic }}</strong>.
        </p>
      </div>

      <v-btn
        variant="tonal"
        prepend-icon="mdi-github"
        :href="githubProfileUrl"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </v-btn>
    </div>

    <section v-if="hasFeaturedProjects" class="mb-8">
      <h2 class="section-heading">Featured Projects</h2>
      <v-row dense>
        <v-col v-for="project in featuredProjects" :key="project.title" cols="12" md="6">
          <v-card class="project-card h-100" rounded="xl" elevation="0">
            <v-card-title class="d-flex align-center justify-space-between ga-3">
              <span>{{ project.title }}</span>
            </v-card-title>
            <v-card-text class="lead">
              <div class="markdown" v-html="renderMarkdown(project.description)" />
            </v-card-text>
            <v-card-text v-if="project.tags?.length" class="chip-row">
              <TagChip v-for="tag in project.tags" :key="tag" :text="tag" />
            </v-card-text>
            <v-card-actions class="px-4 pb-4">
              <v-btn
                v-if="project.links?.demo"
                color="primary"
                variant="flat"
                prepend-icon="mdi-open-in-new"
                :href="project.links.demo"
                target="_blank"
                rel="noreferrer"
              >
                Demo
              </v-btn>
              <v-btn
                v-if="project.links?.repo"
                variant="tonal"
                prepend-icon="mdi-source-repository"
                :href="project.links.repo"
                target="_blank"
                rel="noreferrer"
              >
                Repo
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <section class="mb-4">
      <div class="section-header">
        <h2 class="section-heading mb-0">Public GitHub Repositories</h2>
        <span class="section-meta">{{ githubUsername }} · topic: {{ githubProjectTopic }}</span>
      </div>

      <v-alert
        v-if="repoError"
        type="warning"
        variant="tonal"
        class="mb-4"
        text="GitHub repos could not be loaded right now. You can still view them on GitHub."
      />

      <v-row v-if="isLoadingRepos" dense>
        <v-col v-for="item in 4" :key="item" cols="12" md="6">
          <v-skeleton-loader class="project-card" type="article, actions" />
        </v-col>
      </v-row>

      <v-row v-else-if="hasGithubRepos" dense>
        <v-col v-for="repo in githubRepos" :key="repo.id" cols="12" md="6">
          <v-card class="project-card h-100" rounded="xl" elevation="0">
            <v-card-title class="d-flex align-center justify-space-between ga-3 flex-wrap">
              <span>{{ repo.name }}</span>
              <div class="repo-stats">
                <span v-if="repo.language">{{ repo.language }}</span>
                <span v-if="repo.stars > 0">
                  <v-icon size="16" class="mr-1">mdi-star-outline</v-icon>{{ repo.stars }}
                </span>
              </div>
            </v-card-title>

            <v-card-text class="lead">
              {{ repo.description }}
            </v-card-text>

            <v-card-text class="chip-row">
              <TagChip v-if="repo.language" :text="repo.language" />
              <TagChip v-if="repo.archived" text="Archived" :wiki-enabled="false" />
              <TagChip v-for="topic in repo.topics" :key="topic" :text="`#${topic}`" />
              <TagChip :text="`Created ${formatRepoCreatedAt(repo.createdAt)}`" :wiki-enabled="false" />
              <TagChip :text="`Updated ${formatRepoUpdatedAt(repo.updatedAt)}`" :wiki-enabled="false" />
            </v-card-text>

            <v-card-actions class="px-4 pb-4">
              <v-btn
                v-if="repo.hasPages && repo.pagesUrl"
                color="primary"
                variant="flat"
                prepend-icon="mdi-open-in-new"
                :href="repo.pagesUrl"
                target="_blank"
                rel="noreferrer"
              >
                Open
              </v-btn>
              <v-btn
                variant="tonal"
                prepend-icon="mdi-source-repository"
                :href="repo.htmlUrl"
                target="_blank"
                rel="noreferrer"
              >
                Repo
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <div v-else-if="!hasFeaturedProjects" class="empty-state">
        <p class="mb-2">No public GitHub repos tagged "{{ githubProjectTopic }}" were found yet.</p>
        <button class="text-primary" @click="viewCompanyProjects">View Work Projects</button>
      </div>
    </section>
  </v-container>
</template>

<style lang="scss" scoped>
.project-card {
  background: rgba(var(--v-theme-surface), 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.header-copy {
  max-width: 54ch;
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.section-heading {
  margin: 0 0 16px;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.section-meta {
  opacity: 0.7;
  font-size: 0.95rem;
}

.repo-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  opacity: 0.78;
}

.empty-state {
  text-align: center;
  padding: 24px 0;
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
