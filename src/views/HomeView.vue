<script setup>
import TagChip from '../components/TagChip.vue'
const yearsOfExperience = new Date().getFullYear() - 2021 
</script>

<template>
  <v-container class="page">
    <v-row>
      <v-col cols="12" md="6">
        <div class="kicker">Portfolio</div>
        <h1 class="hero-title">Hello, I'm Curtis</h1>
        <p class="lead">Building applications for your business can be a daunting task; I am here to make it easier. As
          an experienced software developer of {{ yearsOfExperience }} years, I have gained experience with company
          facing software development. Wether it be Flutter for your mobile apps, or Vue for your web applications, I
          have you covered.</p>

        <div class="mt-6 d-flex ga-3 flex-wrap">
          <v-btn color="primary" size="large" prepend-icon="mdi-rocket-launch" to="/projects">View projects</v-btn>
          <v-btn variant="tonal" size="large" prepend-icon="mdi-email-outline" to="/contact">Contact</v-btn>
        </div>

        <div class="mt-6 chip-row">
          <TagChip text="Flutter" />
          <TagChip text="Vue.js" />
          <TagChip text="AngularJS" />
          <TagChip text="PHP" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.kicker {
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.7;
}

.hero-title {
  margin: 10px 0 12px;
  font-size: clamp(2.1rem, 4.5vw, 3.4rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.hero-card,
.info-card {
  background: rgba(var(--v-theme-surface), 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
