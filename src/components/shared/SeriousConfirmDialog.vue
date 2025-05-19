<template>
  <BaseDialog :isOpen="isShown" @onDismissed="$emit('onClosed')">
    <div class="dialog-wrapper">
      <BaseMessageBar :message="{uuid:randomUUID(), text:'Warning: bad things will happen if you don\'t read this', type:MessageType.WARNING,isDismissable:false}"/>
      <slot>

      </slot>
      <p>Type "<strong>{{ expectedText }}</strong>" into the textbox below to confirm.</p>
      <input type="text" v-model="text">
      <p v-if="isErrorShown" class="error-message">Please type exactly "{{ expectedText }}" to confirm</p>
      <div class="buttons-div">
        <button class="primary-hollow-button square-button no-button" @click="onNoClicked">{{ noText }}</button>
        <button class="primary-filled-button square-button yes-button" @click="onYesClicked">{{ yesText }}</button>
      </div>
    </div>
  </BaseDialog>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseDialog from "@/components/ui/BaseDialog.vue";
import BaseMessageBar from "@/components/ui/BaseMessageBar.vue";
import {MessageType} from "@/stores/messageBarStore.js";
import { v4 as uuidv4 } from 'uuid';

export default defineComponent({
  name: "SeriousConfirmDialog",
  components: {BaseMessageBar, BaseDialog},
  props: {
    isShown: {type: Boolean},
    expectedText: {type: String, required: true},
    yesText: {type: String, default: "Yes"},
    noText: {type: String, default: "No"},
  },
  emits: ["onYesClicked", "onNoClicked", "onClosed"],
  data() {
    return {
      text: "",
      isErrorShown: false
    };
  },
  watch: {
    isShown() {
      this.text = "";
      this.isErrorShown = false;
    }
  },
  methods: {
    onNoClicked() {
      this.$emit("onNoClicked");
    },
    onYesClicked() {
      if (this.text == this.expectedText)
        this.$emit("onYesClicked");
      else
        this.isErrorShown = true;
    }
  },
  setup() {
    return {MessageType, randomUUID: () => uuidv4()};
  }
});
</script>

<style scoped>
.dialog-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.yes-button {
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

strong {
  font-weight: bold;
}
</style>
