<script setup>
import { renderMarkdown } from '../utils/markdown'
import firstrobotics_4838 from '../data/firstrobotics_4838.md?raw'
import firstrobotics_4936 from '../data/firstrobotics_4936.md?raw'
import robotics_4838 from '../assets/photos/robotics_4838.jpg'

const volunteering = [
    {
        id: 1,
        name: 'First Robotics',
        children: [
            {
                id: 1,
                name: '4838 - River Rouge',
                dates: '2022 - 2024',
                image: robotics_4838,
                description: firstrobotics_4838,
                actions: [
                    {
                        text: 'Github',
                        icon: 'mdi-github',
                        href: 'https://github.com/riverrouge4838',
                    },
                ]
            },
            {
                id: 2,
                dates: '2017 - 2019',
                name: '4936 - Viral Vortex',
                description: firstrobotics_4936,
            },
        ]
    },
]
</script>

<template>
    <v-container class="page">
        <div class="kicker mb-5">Volunteering</div>
    
        <template v-for="(item) in volunteering" :key="volunteering.id">
        <h2 class="mb-3">{{ item.name }}</h2>
            <v-row dense>
                <v-col v-for="(child, index) in item.children" :key="index" cols="12" md="4" class="px-3">
                    <v-card class="h-100">
                        <v-img v-if="child.image" :src="child.image" width="100%"  max-height="180px" cover />
                        <div v-else class="no-image"></div>
                        <v-card-title class="text-center">{{child.name}}</v-card-title>
                        <v-card-subtitle class="text-secondary font-weight-bold">{{ child.dates }}</v-card-subtitle>
                        <v-card-text class="markdown" v-html="renderMarkdown(child.description)"></v-card-text>
                        <v-card-actions class="px-4 pb-4">
                            <v-btn v-for="action in child.actions" :key="action.text" variant="tonal" :prepend-icon="action.icon" :href="action.href" target="_blank" rel="noreferrer">
                                {{ action.text }}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </template>

        <v-divider class="my-6" />

        
    </v-container>
</template>

<style scoped lang="scss">
.markdown :deep(p) {
    margin: 0 0 .75rem;
}

.markdown :deep(p:last-child) {
    margin-bottom: 0;
}

.markdown :deep(ul),
.markdown :deep(ol) {
    margin: 0.25rem 0 0.75rem 1.25rem;
}

.no-image {
    height: 180px;
    background-color: color-mix(in srgb, black 20%, transparent);
}
</style>