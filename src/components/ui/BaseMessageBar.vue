<template>
  <div class="message-box"
       :class="messageBoxClass">
    <div class="message-content-wrapper">
      <span v-if="message.isMarkdown" class="message-text" v-html="renderMarkdown(message.text)"></span>
      <p v-else class="message-text">{{ message.text }}</p>
      <button v-if="isDismissable" class="dismiss-button inv-button" @click="onDismissed">
        <inline-svg :src="icons.cross"/>
      </button>
    </div>
    <div v-if="message.timeoutMs" class="timeout-bar" :style="{'width':`${(timeoutTimer/message.timeoutMs)*100}%`}"></div>
  </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import {Message, MessageType} from "@/stores/messageBarStore.js";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {renderMarkdown} from "@/utils.js";
import {useIntervalFn} from "@vueuse/core";

export default defineComponent({
  name: "BaseMessageBar",
  components: {InlineSvg},
  emits: ["onDismissed"],
  props: {
    message: {type: Object as PropType<Message>, required: true},
    isDismissable: {type: Boolean, default: true}
  },
  data() {
    return {
      timeoutTimer: 0
    };
  },
  computed: {
    messageBoxClass() {
      if (this.message.type == MessageType.ERROR)
        return "error-bar";
      else if (this.message.type == MessageType.INFO)
        return "info-bar";
      else if (this.message.type == MessageType.WARNING)
        return "warning-bar";
      else if (this.message.type == MessageType.SUCCESS)
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
  mounted() {
    const timerInterval = 25;
    useIntervalFn(() => {
      this.timeoutTimer += timerInterval;
    }, timerInterval);
  },
  setup() {
    return {icons, renderMarkdown, MessageType};
  }
});
</script>
<style scoped>
.message-box {
  width: 100%;
  border-radius: 3px;
  background-color: var(--bar-color);
  color: var(--on-bar-color);
  padding-bottom: 1px;
}

.message-content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.5rem;
  column-gap: 0.5rem;
}

.message-text {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 1rem;
  margin-left: 1rem;
}

.error-bar {
  --bar-color: #E64B3D;
  --on-bar-color: white;
}

.info-bar {
  --bar-color: #CBE5FE;
  --on-bar-color: #004185;
}

.warning-bar {
  --bar-color: #FFF6DC;
  --on-bar-color: #907117;
}

.success-bar {
  --bar-color: #CBFFC0;
  --on-bar-color: #144F14;
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
  color: var(--on-bar-color);
}

.timeout-bar {
  height: 5px;
  background-color: var(--on-bar-color);
}
</style>
