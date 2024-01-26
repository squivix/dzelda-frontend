<template>
  <section>
    <article>
      <inline-svg :src="icons.bookOpen" class="feature-icon"/>
      <h3 class="feature-title">Reading-based learning</h3>
      <p class="feature-text">Don't memorize vocabulary, learn by reading material you like</p>
    </article>
    <article>
      <inline-svg :src="icons.crowdSourcedLookup" class="feature-icon"/>
      <h3 class="feature-title">Crowd-sourced dictionary</h3>
      <p class="feature-text">Look up any word or phrase and see what others have found it to mean</p>
    </article>
    <article>
      <inline-svg :src="icons.lineGraph" class="feature-icon"/>
      <h3 class="feature-title">Track your progress</h3>
      <p class="feature-text">Motivate yourself and see how far you've come</p>
    </article>
    <article>
      <inline-svg :src="icons.madeWithLove" class="feature-icon"/>
      <h3 class="feature-title">Free and open-source</h3>
      <p class="feature-text">Made with love. Supported and developed by the community</p>
    </article>
  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";

export default defineComponent({
  name: "FeaturesSection",
  components: {InlineSvg},
  setup() {
    return {icons};
  }
});
</script>

<style scoped>
section {
  display: grid;
  grid-template-columns: repeat( 4, 1fr);
  flex-direction: row;
  column-gap: max(2rem, 5vw);
  margin-top: 5vh;
  margin-bottom: 15vh;
  justify-content: center;
}

article {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.feature-icon {
  min-width: 75px;
  min-height: 75px;
  max-width: 120px;
  max-height: 120px;
  width: 10vw;
  height: 10vw;
  color: var(--primary-color);
  margin-bottom: 0.75rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  text-align: center;
}

.feature-text {
  color: gray;
  font-size: 1.1rem;
  max-width: 250px;
}

@media screen and (max-width: 750px) {
  section {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 2rem;
  }

  .feature-icon {
    width: 20vw;
    height: 20vw;
  }
}

@media screen and (max-width: 400px) {
  section {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
