<template>
  <BaseDialog :is-open="isShown" @onDismissed="$emit('onClosed')">
    <div v-if="language" class="already-learning-dialog">
      <p>You are already learning {{ language }}</p>
      <button class="primary-filled-button square-button ok-button" @click="$emit('onClosed')">OK
      </button>
    </div>
  </BaseDialog>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseDialog from "@/components/ui/BaseDialog.vue";

export default defineComponent({
  name: "AlreadyLearningDialog",
  components: {BaseDialog},
  emits: ["onClosed"],
  props: {
    language: {type: String, required: false},
    isShown: {type: Boolean},
  }
});
</script>

<style scoped>
.already-learning-dialog {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.ok-button {
  align-self: flex-end;
  padding: 0.5rem 1rem;
}
</style>
