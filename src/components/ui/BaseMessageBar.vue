<template>
  <div
      class="message-box"
      :class="messageBoxClass">
    <div class="message-content-wrapper">
      <p class="message-text">{{ text }}</p>
      <button class="dismiss-button inv-button" @click="onDismissed">
        <font-awesome-icon icon="x"/>
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import {MessageType} from "@/stores/messageBarStore.js";

export default defineComponent({
  name: "BaseMessageBar",
  emits: ["onDismissed"],
  props: {
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<MessageType>,
      required: false,
      default: MessageType.INFO
    }
  },
  computed: {
    messageBoxClass() {
      if (this.type == MessageType.ERROR)
        return "error-message";
      else if (this.type == MessageType.INFO)
        return "info-message";
      else if (this.type == MessageType.WARNING)
        return "warning-message";
      else
        return "";
    }
  },
  methods: {
    onDismissed() {
      this.$emit("onDismissed");
    }
  },
  setup() {
    return {MessageType}
  }
})
</script>
<style scoped>
.message-box {
  width: 100%;
}

.message-content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.5rem;
}

.message-text {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 1rem;
  margin-left: 1rem;
}

.error-message {
  background-color: #F1CBCB;
  color: red;

}

.info-message {
  background-color: #CBE5FE;
  color: #004185;
}

.warning-message {
  background-color: #FFF6DC;
  color: #907117;
}

.dismiss-button {
  height: 100%;
  padding: 0 0.5rem;
}

.dismiss-button:hover {
  cursor: pointer;
}

.dismiss-button svg {
  width: 15px;
  height: 15px;
}
</style>