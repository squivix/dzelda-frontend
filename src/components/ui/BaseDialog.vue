<template>
  <dialog ref="dialog" @click="onDismissed" @cancel.prevent="onDismissed" :class="{'open':isOpen, 'closed':!isOpen}">
    <div @click.stop>
      <slot></slot>
    </div>
  </dialog>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "BaseDialog",
  emits: ["onDismissed", "onClosingTransitionEnd"],
  props: {
    isOpen: {type: Boolean, default: false}
  },
  watch: {
    isOpen() {
      const dialog = this.$refs.dialog as HTMLDialogElement;
      if (this.isOpen)
        dialog.showModal();
      else
        dialog.addEventListener("transitionend", () => {
          dialog.close();
          this.$emit("onClosingTransitionEnd");
        }, {once: true});
    }
  },
  methods: {
    onDismissed() {
      this.$emit("onDismissed");
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
  padding: 0;
  border: none;
  box-shadow: rgba(60, 64, 67, 0.3) 0 1px 2px 0, rgba(60, 64, 67, 0.15) 0 2px 6px 2px;
  border-radius: 5px;
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

dialog.open {
  opacity: 1;
  transform: translateY(0px);
}

dialog.closed {
  transform: translateY(-25px);
  opacity: 0;
}

dialog.open::backdrop {
  opacity: 1;
}

dialog.closed::backdrop {
  opacity: 0;
}

dialog:focus-visible {
  outline-width: 0;
}

dialog > div {
  width: 100%;
  height: 100%;
  padding: 2vh 2vw;
}
</style>
