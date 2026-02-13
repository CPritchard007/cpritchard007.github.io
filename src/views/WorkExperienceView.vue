<script setup>
import { ref } from 'vue'
import { renderMarkdown } from '../utils/markdown'
import TagChip from '../components/TagChip.vue'
import taplaneDescription from '../data/taplane.md?raw'
import gambitVenturesDescription from '../data/gambit-ventures.md?raw'
import codeninjaDescription from '../data/codeninja.md?raw'

const taplaneIcon = 'src/assets/company_logos/taplane.jpeg'
const codeninjaIcon = 'src/assets/company_logos/codeninjas.png'

const timeline = ref([
    {
        id: 1,
        icon: taplaneIcon,
        title: 'Software & Mobile Developer',
        description: taplaneDescription,
        location: 'Taplane Inc.',
        startDate: '2021',
        endDate: 'Present',
        languages: [
            'Vue.js',
            'Flutter',
            'AngularJS',
            'PHP',
            'MySQL',
            'PostgreSQL',
            'MongoDB',
            'Redis',
            'Docker',
            'Kubernetes',
        ],
        buttons: [
            {
                icon: 'mdi-web',
                text: 'Website',
                onClick: () => {
                    window.open('https://www.taplane.com/', '_blank')
                },
            },
            {
                icon: 'mdi-linkedin',
                text: 'LinkedIn',
                onClick: () => {
                    window.open('https://www.linkedin.com/company/taplane/posts/?feedView=all', '_blank')
                },
            }
        ],
    },
    {
        id: 2,
        title: 'Front-End Developer',
        description: gambitVenturesDescription,
        location: 'Gambit Ventures Ltd.',
        startDate: '2020',
        endDate: '2021',
        languages: [
            'WordPress',
            'AngularJS',
            'PHP',
            'MySQL',
        ],
        buttons: [
            {
                icon: 'mdi-web',
                text: 'Website',
                disabled: true,
                onClick: () => {
                    window.open('https://www.gambitventures.ca/', '_blank')
                },
            }
        ],
    },
    {
        id: 3,
        icon: codeninjaIcon,
        title: 'Coding Sensei - Student Coding Mentor',
        description: codeninjaDescription,
        location: 'Code Ninja',
        startDate: '2020',
        endDate: '2021',
        languages: [
            'JavaScript',
            'Lua',
            'Python',
            'C#',
        ],
        buttons: [
            {
                icon: 'mdi-web',
                text: 'Website',
                onClick: () => {
                    window.open('https://www.codeninjas.com/', '_blank')
                },
            },
            {
                icon: 'mdi-linkedin',
                text: 'LinkedIn',
                onClick: () => {
                    window.open('https://www.linkedin.com/company/codeninjas/posts/?feedView=all', '_blank')
                },
            },
        ],
    },
])
</script>

<template>
    <v-container class="page">
        <v-timeline align="start" side="end">
            <v-timeline-item v-for="item in timeline" :key="item.id" fill-dot="true" dot-color="grey" size="80">
                <template #icon>
                    <v-img :src="item.icon" width="100" height="100" class="company-logo" />    
                </template>
                
                <template #opposite>
                    <div class="text-end">
                        <div class="text-h6">{{ item.location }}</div>
                        <div>{{ item.startDate }} - {{ item.endDate }}</div>
                    </div>
                </template>

                <div>
                    <h2 class="mb-2">{{ item.title }}</h2>
                    <div class="markdown" v-html="renderMarkdown(item.description)" />
                </div>

                <div class="mt-6 chip-row">
                    <TagChip v-for="lang in item.languages" :key="lang" :text="lang" />
                </div>

                <div class="mt-6 d-flex ga-3 flex-wrap">
                    <v-btn v-for="button in item.buttons" :disabled="button.disabled" :key="button.text"
                        :ref="button.ref" @click="button.onClick" :target="button.target" :rel="button.rel"
                        variant="tonal" size="small" color="primary" :prepend-icon="button.icon ?? 'mdi-open-in-new'">

                        {{ button.text }}
                    </v-btn>
                </div>
            </v-timeline-item>
        </v-timeline>
    </v-container>
</template>

<style scoped lang="scss">
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

.markdown :deep(h3) {
    margin-top: 1.3rem;
}

.company-logo {
    border-radius: 50%;
    object-fit: cover;
}
</style>