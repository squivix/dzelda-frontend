<template>
  <dialog ref="dialog">
    <slot></slot>
  </dialog>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "BaseDialog",
  props: {
    isOpen: {type: Boolean, default: false}
  },
  watch: {
    isOpen() {
      const dialog = this.$refs.dialog as HTMLDialogElement;
      if (this.isOpen)
        dialog.showModal();
      else
        dialog.close();
    }
  },
  mounted() {
    const dialog = this.$refs.dialog as HTMLDialogElement;
    if (this.isOpen)
      dialog.showModal();
  }
});
</script>

<style scoped>
dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0;
  border: none;
  padding: 4vw 4vh;
  transform: translate(-50%, -50%);
  box-shadow: rgba(60, 64, 67, 0.3) 0 1px 2px 0, rgba(60, 64, 67, 0.15) 0 2px 6px 2px;
  animation: drop-in 0.25s ease-in, fade-in 0.25s ease-in;
}

dialog:focus-visible {
  outline-width: 0;
}

dialog::backdrop {
  animation: fade-in 0.25s ease-in;

}

@keyframes drop-in {
  0% {
    transform: translate(-50%, -50%) translateY(-15px);
  }
  100% {
    transform: translate(-50%, -50%) translateY(0px);
  }
}
@keyframes fade-in {
  0% {
    opacity: 0.2;
  }

  100% {
    opacity: 1;
  }
}
</style>
