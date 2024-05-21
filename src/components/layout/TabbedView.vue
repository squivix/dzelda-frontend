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
  name: "TabbedView",
  emits: ["onTabChanged"],
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
    setCurrentTab(tab: { id: string, label: string }) {
      if (tab.id != this.currentTab.id) {
        this.$emit("onTabChanged");
        this.currentTab = tab;
      }
    },
  },
});
</script>

<style scoped>
h2 {
  font-size: 2rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}


</style>
