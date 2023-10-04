<template>
  <nav class="tab-bar">
    <ul class="tab-labels">
      <li
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab-label', { 'current-tab': currentTab === tab }]"
          @click="()=> $emit('onTabClick', tab)">
        {{ tab }}
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";

export default defineComponent({
  name: "BaseTabBar",
  emits: ["onTabClick"],
  props: {
    tabs: {
      type: Array as PropType<string[]>,
      required: true
    },
    currentTab: {
      type: String,
      required: true,
    }
  }
});
</script>

<style scoped>

h2 {
  font-size: 2rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.tab-labels {
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
}

.tab-labels .tab-label {
  font-size: 1.2rem;
  padding: 1rem 1rem;
}

.tab-labels .tab-label:hover {
  cursor: pointer;
}

.tab-labels .tab-label.current-tab {
  border-bottom: 3px solid var(--secondary-color);
}
</style>
