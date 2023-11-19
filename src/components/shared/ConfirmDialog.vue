<template>
  <BaseDialog :is-open="isShown" @onBackDropClick="$emit('onClosed')">
    <div class="dialog-wrapper">
      <slot>

      </slot>
      <div class="buttons-div">
        <button class="primary-filled-button square-button no-button" @click="onNoClicked">No</button>
        <button class="primary-filled-button square-button yes-button" @click="onYesClicked">Yes</button>
      </div>
    </div>
  </BaseDialog>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseDialog from "@/components/ui/BaseDialog.vue";

export default defineComponent({
  name: "ConfirmDialog",
  components: {BaseDialog},
  props: {isShown: {type: Boolean},},
  emits: ["onYesClicked", "onNoClicked","onClosed"],
  methods: {
    onNoClicked() {
      this.$emit("onNoClicked");
    },
    onYesClicked() {
      this.$emit("onYesClicked");
    }
  }
});
</script>

<style scoped>
.dialog-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.no-button {
  background-color: #FF3333;
  border-color: #FF3333;
}

.buttons-div {
  align-self: flex-end;
  display: flex;
  column-gap: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
}
</style>
