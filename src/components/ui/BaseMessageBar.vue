<template>
  <div
      class="message-box"
      :class="messageBoxClass">
    <div class="message-content-wrapper">
      <p class="message-text">{{ text }}</p>
      <button v-if="isDismissable" class="dismiss-button inv-button" @click="onDismissed">
        <inline-svg :src="icons.cross"/>
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import {MessageType} from "@/stores/messageBarStore.js";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";

export default defineComponent({
  name: "BaseMessageBar",
  components: {InlineSvg},
  emits: ["onDismissed"],
  props: {
    text: {type: String, required: true,},
    type: {type: String as PropType<MessageType>, required: false, default: MessageType.INFO},
    isDismissable: {type: Boolean, default: true}
  },
  computed: {
    messageBoxClass() {
      if (this.type == MessageType.ERROR)
        return "error-bar";
      else if (this.type == MessageType.INFO)
        return "info-bar";
      else if (this.type == MessageType.WARNING)
        return "warning-bar";
      else if (this.type == MessageType.SUCCESS)
        return "success-bar";
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
    return {icons, MessageType};
  }
});
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

.error-bar {
  background-color: #F1CBCB;
  color: red;
}

.info-bar {
  background-color: #CBE5FE;
  color: #004185;
}

.warning-bar {
  background-color: #FFF6DC;
  color: #907117;
}

.success-bar {
  background-color: #CBFFC0;
  color: #144F14;
}

.dismiss-button {
  height: 100%;
  padding: 0 0.5rem;
}

.dismiss-button:hover {
  cursor: pointer;
}

.dismiss-button svg {
  width: 12px;
  height: 12px;
  color: dimgrey;
}
</style>
