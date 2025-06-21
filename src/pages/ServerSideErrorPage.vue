<template>
  <div>
    <h2>500 Something went wrong Server-side</h2>
    <p>Please come back later</p>
    <router-link :to="{name:'home'}">Go to home page</router-link>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "ServerSideErrorPage",
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
  margin-bottom: 0.25rem;
}

p {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}
</style>
