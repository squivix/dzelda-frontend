<template>
  <div>
    <h2>404 Page not found</h2>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "NotFoundPage",
  components: {}
});
</script>

<style scoped>
div {
  text-align: center;
  color: grey;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

h2 {
  font-size: 1.25rem;
  margin-bottom: 0.2rem;
}

p {
  font-size: 1.1rem;
}
</style>
