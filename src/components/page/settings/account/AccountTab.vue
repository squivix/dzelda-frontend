<template>
  <div class="settings-tab styled-scrollbars">
    <div class="tab-wrapper">
      <h2>Account</h2>
      <ChangeEmailSection/>
      <ChangePasswordSection/>
      <DeleteAccountSection/>
    </div>
  </div>
</template>

<script lang="ts">
import ChangeEmailSection from "@/components/page/settings/account/ChangeEmailSection.vue";
import ChangePasswordSection from "@/components/page/settings/account/ChangePasswordSection.vue";
import DeleteAccountSection from "@/components/page/settings/account/DeleteAccountSection.vue";

export default {
  name: "AccountTab",
  components: {DeleteAccountSection, ChangeEmailSection, ChangePasswordSection},
};
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
  font-size: 1.2rem;
}

section:deep(form label) {
  font-size: 0.85rem;
}

</style>
