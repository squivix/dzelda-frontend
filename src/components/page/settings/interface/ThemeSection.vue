<template>
  <section>
    <h3>Theme</h3>
    <form @submit.prevent="submitThemeChange">
      <select>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <SubmitButton type="button" class="primary-filled-button capsule-button">Save</SubmitButton>
    </form>
  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import {useLocalSettingsStore} from "@/stores/settingsStore.js";

export default defineComponent({
  name: "ThemeSection",
  components: {SubmitButton},
  methods: {
    submitThemeChange() {

    }
  },
  setup() {
    return {localSettingsStore: useLocalSettingsStore()};
  }
});
</script>

<style scoped>
form {
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
  align-items: center;
}
</style>
