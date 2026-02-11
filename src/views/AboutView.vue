<template>
  <v-container class="page">
    <h1 class="section-title">About</h1>
    <p class="lead">
      Write a short bio here. Add your skills, the kind of work you’re looking for, and a few fun details.
    </p>

    <v-row class="mt-6" dense>
      <v-col cols="12" md="6">
        <v-card class="about-card" rounded="xl" elevation="0">
          <v-card-title>Focus</v-card-title>
          <v-card-text class="lead">
            - Product-minded engineering<br />
            - Clean UI and good UX<br />
            - Fast, maintainable code
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="about-card" rounded="xl" elevation="0">
          <v-card-title>Toolbox</v-card-title>
          <v-card-text class="chip-row">
            <v-chip size="small" label>Vue</v-chip>
            <v-chip size="small" label>Vuetify</v-chip>
            <v-chip size="small" label>SCSS</v-chip>
            <v-chip size="small" label>Vite</v-chip>
            <v-chip size="small" label>GitHub Pages</v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.about-card {
  background: rgba(var(--v-theme-surface), 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>

