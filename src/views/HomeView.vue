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
      <v-col  cols="12" md="6">
        <v-card class="pa-3" outlined>
          <v-card-text class="overflow-x-auto">
            <v-code type="language-typescript">
              <pre class="text-small">
<span class="hl-keyword">const</span> <span class="hl-variable">coffee</span><span class="hl-operator">:</span> <span class="hl-type">number</span> <span class="hl-operator">=</span> <span class="hl-number">Infinity</span><span class="hl-punctuation">;</span>
<span class="hl-keyword">let</span> <span class="hl-variable">bug</span><span class="hl-operator">:</span> <span class="hl-type">unknown</span> <span class="hl-operator">=</span> <span class="hl-string">"works on my machine"</span><span class="hl-punctuation">;</span>
<span class="hl-keyword">while</span> <span class="hl-punctuation">(</span><span class="hl-variable">coffee</span> <span class="hl-operator">&amp;&amp;</span> <span class="hl-variable">bug</span><span class="hl-punctuation">)</span> <span class="hl-punctuation">{</span>
  <span class="hl-variable">console</span>.<span class="hl-function">log</span><span class="hl-punctuation">(</span><span class="hl-string">"npm install"</span><span class="hl-punctuation">)</span><span class="hl-punctuation">;</span> <span class="hl-comment">// fixes everything</span>
  <span class="hl-keyword">try</span> <span class="hl-punctuation">{</span> <span class="hl-function">deploy</span><span class="hl-punctuation">(</span><span class="hl-punctuation">)</span><span class="hl-punctuation">;</span> <span class="hl-punctuation">}</span>
  <span class="hl-keyword">catch</span> <span class="hl-punctuation">{</span> <span class="hl-variable">bug</span> <span class="hl-operator">=</span> <span class="hl-string">"¯\\_(ツ)_/¯"</span><span class="hl-punctuation">;</span> <span class="hl-punctuation">}</span>
  <span class="hl-keyword">finally</span> <span class="hl-punctuation">{</span> <span class="hl-variable">console</span>.<span class="hl-function">log</span><span class="hl-punctuation">(</span><span class="hl-string">"Have you tried turning it off and on again?"</span><span class="hl-punctuation">)</span><span class="hl-punctuation">;</span> <span class="hl-punctuation">}</span>
<span class="hl-punctuation">}</span>
<span class="hl-keyword">function</span> <span class="hl-function">deploy</span><span class="hl-punctuation">(</span><span class="hl-punctuation">)</span><span class="hl-operator">:</span> <span class="hl-type">never</span> <span class="hl-punctuation">{</span> <span class="hl-keyword">throw</span> <span class="hl-keyword">new</span> <span class="hl-type">Error</span><span class="hl-punctuation">(</span><span class="hl-string">"CI failed, not reproducible locally."</span><span class="hl-punctuation">)</span><span class="hl-punctuation">;</span> <span class="hl-punctuation">}</span>
              </pre>
            </v-code>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="hero-card mt-6" rounded="md" elevation="0">
    <v-card-title class="text-primary">Adapting to the AI Era</v-card-title>
    <v-card-text class="">
      <p>
        Artificial intelligence is reshaping the landscape of software development, setting new expectations for developers everywhere. This evolution cannot be ignored—we must embrace and adapt to the opportunities and challenges it brings.      
      </p>
      <p class="mt-2">
      I believe developers have a duty to leverage AI tools responsibly to boost productivity and enhance the quality of their work, while continuously sharpening their own problem-solving skills and expertise.
      </p>
    </v-card-text>
    </v-card>
  </v-container>
</template>

<style lang="scss" scoped>
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

.hl-keyword {
  color: #82AAFF;
}

.hl-variable {
  color: #C3E88D;
}

.hl-operator {
  color: #F78C6C;
}

.hl-type {
  color: #F78C6C;
}

.hl-number {
  color: #F78C6C;
}

.hl-string {
  color: #F78C6C;
}

.hl-punctuation {
  color: #F78C6C;
}

.hl-comment {
  color: #616161;
}

</style>
