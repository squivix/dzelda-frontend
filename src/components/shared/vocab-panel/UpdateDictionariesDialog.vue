<template>
  <BaseDialog :isOpen="isShown" @onDismissed="$emit('onClosed')">
    <UpdateDictionariesForm :languageCode="languageCode" @onSubmitted="$emit('onSubmitted')" @onCanceled="$emit('onClosed')"/>
  </BaseDialog>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseDialog from "@/components/ui/BaseDialog.vue";
import {VueDraggableNext as VueDraggable} from "vue-draggable-next";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import UpdateDictionariesForm from "@/components/shared/UpdateDictionariesForm.vue";

export default defineComponent({
  name: "UpdateDictionariesDialog",
  components: {UpdateDictionariesForm, SubmitButton, LoadingScreen, InlineSvg, BaseDialog, VueDraggable},
  emits: ["onClosed", "onSubmitted"],
  props: {
    isShown: {type: Boolean, required: true},
    languageCode: {type: String, required: true},
  },
  data() {
    return {};
  },
  watch: {
    isShown() {
      // if (this.isShown)
      // this.fetchDictionaries();
    },
  },
  setup() {
    return {
      icons,
    };
  }
});
</script>

<style scoped>
</style>
