<template>
  <section>
    <h3>Theme</h3>
    <select v-model="theme">
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import {useLocalSettingsStore} from "@/stores/settingsStore.js";

export default defineComponent({
  name: "ThemeSection",
  data() {
    return {
      theme: (this.localSettingsStore as any).theme as "light" | "dark"
    };
  },
  watch: {
    theme() {
      this.localSettingsStore.theme = this.theme;
    }
  },
  setup() {
    return {localSettingsStore: useLocalSettingsStore()};
  }
});
</script>

<style scoped>
select {
  align-self: flex-start;
  width: 100px;
}
</style>
