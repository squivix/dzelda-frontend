<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "BaseFiltersCard"
});
</script>

<style scoped>
.card {
  background-color: var(--primary-faint-color);
  color: var(--panel-new-text-color);
  padding: 1rem;
  box-sizing: border-box;
  box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
}
</style>
