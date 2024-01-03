<template>
  <div>
    <div class="settings-tab styled-scrollbars">
      <div class="tab-wrapper">
        <h2>Interface</h2>
        <ThemeSection/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import ThemeSection from "@/components/page/settings/interface/ThemeSection.vue";

export default defineComponent({
  name: "InterfaceTab",
  components: {ThemeSection},

});
</script>

<style scoped>

.settings-tab {
  display: flex;
  flex-direction: column;
  overflow: auto;
  row-gap: 1rem;
}

.tab-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
  width: 75%;
  max-width: 500px;
  padding: 0 0.1rem;
}

h2 {
  font-size: 1.75rem;
}

section {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

section:deep(h3) {
  font-size: 1.1rem;
}

</style>
