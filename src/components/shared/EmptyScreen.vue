<template>
  <div class="empty-screen-wrapper">
    <slot name="with-filters" v-if="hasFilters">
      <div class="empty-screen">
        <p v-if="!!message">{{ message }}</p>
        <p v-else>Nothing found that matches your query</p>
      </div>
    </slot>
    <slot name="no-filters" v-else>
      <div class="empty-screen">
        <p v-if="!!message">{{ message }}</p>
        <p v-else>Nothing found</p>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import loadingSpinner from "@/assets/images/loading-spinner.svg"
import InlineSvg from "vue-inline-svg";

export default defineComponent({
  name: "EmptyScreen",
  components: {InlineSvg},
  props: {
    message: {type: String, required: false},
    hasFilters: {type: Boolean, required: false, default: false}
  },
})
</script>

<style scoped>
.empty-screen-wrapper {
  height: 45vh;
  display: grid;
  place-items: center;
  text-align: center
}
</style>

<style>
.empty-screen {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  justify-content: center;
  align-items: center;
  color: grey;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.empty-screen button {
  color: grey;
}
</style>