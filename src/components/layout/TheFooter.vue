<template>
  <footer>
    <nav class="page-links">
      <ul>
      </ul>
    </nav>


    <nav class="social-links">
      <ul>
        <li><a href="https://github.com/squivix/dzelda-frontend" target="_blank">
          <img :src="assets.githubLogo" alt="github link">
        </a></li>
      </ul>
    </nav>
  </footer>
</template>
<script lang="ts">
import githubLogo from "@/assets/images/github-logo.svg";

export default {
  name: "TheFooter",
  components: {},
  setup() {
    return {assets: {githubLogo}};
  }
};
</script>
<style scoped>
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #F2F2F2;
}

.social-links ul {
  display: flex;
  column-gap: 1rem;
}

.social-links img {
  width: 25px;
  height: 25px;
}
</style>
