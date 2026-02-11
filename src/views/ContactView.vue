<script setup>
const email = 'you@example.com'
</script>

<template>
  <v-container class="page">
    <h1 class="section-title">Contact</h1>
    <p class="lead">The fastest way to reach me is email.</p>

    <v-row class="mt-6" dense>
      <v-col cols="12" md="7">
        <v-card class="contact-card" rounded="xl" elevation="0">
          <v-card-title>Email</v-card-title>
          <v-card-text class="lead">
            <a :href="`mailto:${email}`">{{ email }}</a>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-btn color="primary" prepend-icon="mdi-email-outline" :href="`mailto:${email}`">Email me</v-btn>
            <v-btn variant="tonal" prepend-icon="mdi-linkedin" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
              LinkedIn
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="contact-card" rounded="xl" elevation="0">
          <v-card-title>Availability</v-card-title>
          <v-card-text class="lead">
            Add your location, time zone, and what you’re open to (full-time, contract, freelance).
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.contact-card {
  background: rgba(var(--v-theme-surface), 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>

