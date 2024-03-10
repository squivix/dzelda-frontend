<template>
  <div class="loading-screen">
    <div>
      <inline-svg class="spinner" :src="icons.loadingSpinnerTailSpin"/>
      <p v-if="loadingStatus">{{ loadingStatus }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";

export default defineComponent({
  name: "LoadingScreen",
  components: {InlineSvg},
  props: {
    loadingStatus: {type: String, default: ""}
  },
  setup() {
    return {icons};
  }
});
</script>

<style scoped>
.loading-screen {
  height: 50vh;
  display: grid;
  place-items: center;
}

.spinner {
  color: var(--secondary-color);
  width: 100px;
  height: 100px;
}

.loading-screen > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 1.5rem;
}

p {
  font-size: 1.15rem;
}

</style>
