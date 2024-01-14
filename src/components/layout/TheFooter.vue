<template>
  <footer>
    <nav class="page-links">
      <ul>
      </ul>
    </nav>
    <nav class="social-links">
      <ul>
        <li><a href="https://github.com/squivix/dzelda-frontend" target="_blank">
          <inline-svg :src="icons.githubLogo" alt="github link"/>
        </a></li>
      </ul>
    </nav>
  </footer>
</template>
<script lang="ts">
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";

export default {
  name: "TheFooter",
  components: {InlineSvg},
  setup() {
    return {icons};
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
