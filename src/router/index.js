import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import AboutView from '../views/AboutView.vue'
import ContactView from '../views/ContactView.vue'
import ResumeView from '../views/ResumeView.vue'
import WorkExperienceView from '../views/WorkExperienceView.vue'
import VolunteeringView from '../views/VolunteeringView.vue'

const githubProfileUrl = 'https://github.com/cpritchard007'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/github',
      name: 'github',
      beforeEnter() {
        window.location.assign(githubProfileUrl)
        return false
      },
    },
    { path: '/projects', name: 'projects', component: ProjectsView },
    {
      path: '/resume',
      name: 'resume',
      component: ResumeView,
      props: {
        title: 'Resume',
        description: 'Review my resume in-app, then open or download the PDF if you want the original file.',
      },
    },
    {
      path: '/pdf-viewer',
      name: 'pdf-viewer',
      component: ResumeView,
      props: (route) => ({
        documentName: typeof route.query.file === 'string' ? route.query.file : 'resume.pdf',
        title: typeof route.query.title === 'string' ? route.query.title : 'PDF Viewer',
        description:
          'A reusable viewer route for local PDFs in the public directory, styled to behave like the rest of the site.',
      }),
    },
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
