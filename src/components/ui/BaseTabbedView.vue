<template>
  <div>
    <nav class="tab-bar">
      <ul class="tab-labels">
        <li
            v-for="(tab, index) in tabs"
            :key="index"
            :class="['tab-label', { 'current-tab': currentTab.id === tab.id }]"
            @click="setCurrentTab(tab)"
        >
          {{ tab.label }}
        </li>
      </ul>
    </nav>

    <template v-for="tab in tabs">
      <slot v-if="tab.id==currentTab.id" :name="tab.id"></slot>
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";

export default defineComponent({
  name: "BaseTabbedView",
  props: {
    tabs: {
      type: Array as PropType<Array<{ id: string, label: string }>>,
      required: true
    },
  },
  data() {
    return {
      currentTab: this.tabs[0] ?? null,
    };
  },
  methods: {
    setCurrentTab(tab) {
      this.currentTab = tab;
    },
  },
});
</script>

<style scoped>
.tabbed-page-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  width: 70vw;
}

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
