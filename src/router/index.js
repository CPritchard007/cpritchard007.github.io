import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import AboutView from '../views/AboutView.vue'
import ContactView from '../views/ContactView.vue'
import ResumeView from '../views/ResumeView.vue'
import WorkExperienceView from '../views/WorkExperienceView.vue'
import VolunteeringView from '../views/VolunteeringView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/projects', name: 'projects', component: ProjectsView },
    { path: '/resume', name: 'resume', component: ResumeView },
    { path: '/work-experience', name: 'work-experience', component: WorkExperienceView },
    { path: '/volunteering', name: 'volunteering', component: VolunteeringView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/contact', name: 'contact', component: ContactView },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router

