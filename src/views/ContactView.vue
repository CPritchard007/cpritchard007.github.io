<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapElement = ref(null)
let mapInstance = null
let circle = null

onMounted(() => {
  if (!mapElement.value) return

  mapInstance = L.map(mapElement.value).setView([42.305362, -82.869548], 9)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(mapInstance)

  circle = L.circle([42.305362, -82.869548], {
    radius: 30_000,
    color: 'green',
    fillColor: 'green',
    fillOpacity: 0.1,
    opacity: 0.4,
  }).addTo(mapInstance)
})

onBeforeUnmount(() => {
  if (mapInstance) {
    circle.remove()
    mapInstance.remove()
    mapInstance = null
  }
})
</script>

<template>
  <v-container class="page">
    <div class="kicker">Contact Me</div>
    
    <v-card class="contact-card mt-6" rounded="xl" elevation="0">
      <v-card-title>Contact Information</v-card-title>
      <v-card-subtitle>
        Interested in working together? Do you have a questions? please feel free to reach out.
      </v-card-subtitle>
      <v-card-text>
    <v-row class=" align-items-stretch" dense>
      <v-col cols="12" md="7">
            <div>
              <v-icon color="primary" class="mr-2">mdi-email-outline</v-icon>
              <a href="mailto:cpritchard649@gmail.com" target="_blank" rel="noreferrer">cpritchard649@gmail.com</a>
            </div>

            <div>
              <v-icon color="primary" class="mr-2">mdi-phone-outline</v-icon>
              <a :href="`tel:5199034121`">+1 (519) 903-4121</a>
            </div>

            <div>
              <v-icon color="primary" class="mr-2">mdi-linkedin</v-icon>
              <a href="https://www.linkedin.com/in/curtis-pritchard/" target="_blank" rel="noreferrer">
                linkedin.com/in/curtis-pritchard/
              </a>
            </div>

            <div>
              <v-icon color="primary" class="mr-2">mdi-github</v-icon>
              <a href="https://github.com/cpritchard007" target="_blank" rel="noreferrer">
                github.com/cpritchard007
              </a>
            </div>

            <div>
              <v-icon color="primary" class="mr-2">mdi-map-marker-outline</v-icon>
              Windsor, ON, Canada
            </div>

            <div>
              <v-icon color="primary" class="mr-2">mdi-clock-outline</v-icon>
              <span>Available: Mon–Fri, 9am–5pm EST</span>
            </div>        
      </v-col>

      <v-col cols="12" md="5">
        <div ref="mapElement" class="map"></div>
      </v-col>
    </v-row>
    </v-card-text>
    <v-card-actions>
            <v-btn color="primary" prepend-icon="mdi-email-outline" :href="`mailto:${email}`">
              Email me
            </v-btn>
            <v-btn variant="tonal" prepend-icon="mdi-linkedin" href="https://www.linkedin.com/in/curtis-pritchard/" target="_blank" rel="noreferrer">
              LinkedIn
            </v-btn>
            <v-btn variant="tonal" prepend-icon="mdi-github" href="https://github.com/cpritchard007" target="_blank" rel="noreferrer">
              GitHub
            </v-btn>
            <v-btn variant="tonal" prepend-icon="mdi-phone-outline" :href="`tel:5199034121`">
              Call
            </v-btn>
          </v-card-actions>
    </v-card>
  </v-container>
</template>

<style lang="scss" scoped>
.contact-card {
  background: rgba(var(--v-theme-surface), 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.map {
  width: 100%;
  min-height: 320px;
  height: 100%;
  border-radius: 16px;
    overflow: hidden;
}
</style>
