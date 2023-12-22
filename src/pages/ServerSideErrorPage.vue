<template>
  <div>
    <h2>500 Something went wrong Server-side</h2>
    <p>Please come back later</p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";

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
  margin-bottom: 0.2rem;
}

p {
  font-size: 1.1rem;
}
</style>
