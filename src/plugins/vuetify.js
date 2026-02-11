// Vuetify plugin
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#0b1020',
          surface: '#111a33',
          primary: '#6c63ff',
          secondary: '#00c2a8',
        },
      },
      light: {
        dark: false,
        colors: {
          background: '#fbfbfe',
          surface: '#ffffff',
          primary: '#4b4ae6',
          secondary: '#008c7a',
        },
      },
    },
  },
})

