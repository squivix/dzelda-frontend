<template>
  <nav ref="navRef" :class="{'expanded-nav':isExpanded}">
    <ul ref="ulRef">
      <li>
        <router-link :to="{ name: 'explore' }">
          Explore
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'my-library' }">
          My Library
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'my-vocab' }">
          My Vocab
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "NavDropDown",
  props: {isExpanded: {type: Boolean, required: true}},
  mounted() {
    const navElement = this.$refs["navRef"] as HTMLElement;
    const ulElement = this.$refs["ulRef"] as HTMLElement;
    const liElements = ulElement.querySelectorAll("li");
    if (liElements.length > 0) {
      const expandedHeight = liElements.length * liElements[0].offsetHeight;
      navElement.style.setProperty("--expanded-height", `${expandedHeight}px`);
    }
  }
});
</script>

<style scoped>
nav {
  transition: max-height 0.75s;
  max-height: 0;
  overflow: hidden;
  --expanded-height: 165px;
}

.expanded-nav {
  max-height: var(--expanded-height);
}

nav > ul {
  display: flex;
  flex-direction: column;
  width: 100%;
  font: 900 1.25rem sans-serif;
  color: var(--on-primary-color);
  row-gap: 0;
}

a {
  display: inline-block;
  padding: 1rem;
  color: inherit;
  text-decoration: none;
  background-color: var(--primary-color-dark);
  width: 100%;
}

</style>
