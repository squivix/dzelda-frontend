<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "BaseFiltersCard"
})
</script>

<style scoped>
.card {
  background-color: #CCE4F5;
}
</style>