<template>
  <EmptyScreen>
    <p>500 Something went wrong Server-side</p>
    <p>Please come back later</p>
  </EmptyScreen>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";

export default defineComponent({
  name: "ServerSideErrorPage",
  components: {EmptyScreen}
});
</script>

<style scoped>

</style>
