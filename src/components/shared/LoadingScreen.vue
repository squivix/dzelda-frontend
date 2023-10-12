<template>
  <div>
    <inline-svg class="spinner" :src="assets.loadingSpinner"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import loadingSpinner from "@/assets/images/loading-spinner.svg"
import InlineSvg from "vue-inline-svg";

export default defineComponent({
  name: "LoadingScreen",
  components: {InlineSvg},
  setup() {
    return {assets: {loadingSpinner}}
  }
})
</script>

<style scoped>
div {
  height: 50vh;
  display: grid;
  place-items: center;
}

.spinner {
  --color: var(--secondary-color);
  width: 100px;
  height: 100px;
}

</style>