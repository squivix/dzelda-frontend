<template>
  <footer>
    <nav class="page-links">
      <ul>
      </ul>
    </nav>
    <nav class="social-links">
      <ul>
        <li><a href="https://github.com/squivix/dzelda-frontend" target="_blank">
          <inline-svg :src="githubLogo" alt="github link"/>
        </a></li>
      </ul>
    </nav>
  </footer>
</template>
<script lang="ts">
import githubLogo from "@/assets/images/github-logo.svg";
import InlineSvg from "vue-inline-svg";

export default {
  name: "Footer",
  components: {InlineSvg},
  setup() {
    return {githubLogo};
  }
};
</script>
<style scoped>
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: var(--footer-color);
  border-top: 1px solid color-mix(in srgb, var(--footer-color), white 10%);
}

.social-links ul {
  display: flex;
  column-gap: 1rem;
}

.social-links svg {
  width: 25px;
  height: 25px;
  opacity: 0.75;
  color: var(--on-background-color);
}

.social-links svg:hover {
  opacity: 1;
}
</style>
