<template>
  <div>
    <inline-svg class="spinner" :src="icons.loadingSpinner"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";

export default defineComponent({
  name: "LoadingScreen",
  components: {InlineSvg},
  setup() {
    return {icons}
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