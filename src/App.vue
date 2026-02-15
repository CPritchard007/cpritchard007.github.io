<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { onMounted } from 'vue'

const drawer = ref(false)

const route = useRoute()
const router = useRouter()

const items = [
  { title: 'Home', to: { name: 'home' }, icon: 'mdi-home-outline' },
  { title: 'Projects', to: { name: 'projects' }, icon: 'mdi-briefcase-outline' },
  { title: 'Work Experience', to: { name: 'work-experience' }, icon: 'mdi-account-group-outline' },
  { title: 'Volunteering', to: { name: 'volunteering' }, icon: 'mdi-account-hard-hat-outline' },
  // { title: 'Resume', to: { name: 'resume' }, icon: 'mdi-file-outline' },
  // { title: 'About', to: { name: 'about' }, icon: 'mdi-account-circle-outline' },
  { title: 'Contact', to: { name: 'contact' }, icon: 'mdi-email-outline' },
]

const socialLinks = [
  { title: 'LinkedIn', click: () => window.open('https://www.linkedin.com/in/curtis-pritchard/', '_blank'), icon: 'mdi-linkedin' },
  { title: 'Phone', click: () => window.open('tel:5199034121'), icon: 'mdi-phone' },
  { title: 'Email', click: () => window.open('mailto:cpritchard649@gmail.com'), icon: 'mdi-email' },
]

const activeTitle = computed(() => items.find((i) => i.to?.name === route.name)?.title ?? 'Portfolio')

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}

function goHome() {
  router.push({ name: 'home' })
}

onMounted(() => {
  console.log(`%cThank you for visiting my portfolio, I hope you enjoy your stay.`, 'color: #4b4ae6; font-weight: semibold; font-size: 1.2em;')
  console.log(`
It has truly been an incredible journey so far, and I’m sincerely grateful to everyone who has supported me along the way.
I look forward to continuing my work in the software development industry, helping others grow, and becoming the best versions of themselves.

You will find that I have placed many different easter eggs throughout the portfolio, it serves as a small insentive to looking through my project. If you have any critiques or just want to say hello, feel free to reach out to me.
  `)
  console.log(`%c+1 (519) 903-4121\ncpritchard649@gmail.com`, 'color: #4b4ae6; font-weight: semibold; font-size: 1.2em;')
})
</script>

<template>
  <v-app>
    <v-app-bar elevation="0" class="app-bar" density="comfortable">
      <v-app-bar-nav-icon class="d-sm-none" @click="drawer = !drawer" />
      <v-btn class="brand" variant="text" @click="goHome">Curtis Pritchard</v-btn>

      <v-spacer />

      <div class="d-none d-sm-flex ga-1">
        <v-btn v-for="item in items" :key="item.title" variant="text" :to="item.to" :prepend-icon="item.icon">
          {{ item.title }}
        </v-btn>
      </div>

      <v-divider vertical class="mx-2 d-none d-sm-flex" />

      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon variant="text"
            :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'" @click="toggleTheme">
            <v-icon :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" />
          </v-btn>
        </template>
        <span>Toggle theme</span>
      </v-tooltip>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary class="d-sm-none">
      <v-list density="comfortable" nav>
        <v-list-item :title="activeTitle" subtitle="Navigation" />
        <v-divider class="my-2" />
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" :prepend-icon="item.icon">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
      
    </v-main>

  <v-fab
    color="primary"
    location="bottom right"
    app
    size="large"
    class="fab-social"
    icon
  >
  <v-icon class="mdi mdi-chat-outline" ></v-icon>
  <v-speed-dial location="top center" transition="slide-y-transition" activator="parent">
          <v-btn v-for="link in socialLinks" :key="link.title" icon @click="link.click">
            <v-icon :class="['mdi', link.icon]" size="24"></v-icon>
          </v-btn>
        </v-speed-dial>
</v-fab>
  </v-app>
</template>

<style lang="scss" scoped>
.app-bar {
  backdrop-filter: saturate(160%) blur(10px);
  background: rgba(var(--v-theme-surface), 0.75);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand {
  font-weight: 800;
  letter-spacing: 0.2px;
  text-transform: none;
}

.app-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-row {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.footer-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.muted {
  opacity: 0.72;
}
</style>
