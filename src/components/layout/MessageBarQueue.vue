<template>
  <div class="message-bar-queue">
    <ol>
      <li v-for="(message, index) in messageBarStore.topBarMessageQueue" :key="message.uuid">
        <BaseMessageBar :message="message"
                        @onDismissed="()=>messageBarStore.removeTopBarMessage(message)"/>
      </li>
    </ol>
    <ol class="side-message-list">
      <li v-for="(i) in messageBarStore.sideMessageQueue.length" :key="messageBarStore.sideMessageQueue[messageBarStore.sideMessageQueue.length-i].uuid">
        <BaseMessageBar :message="messageBarStore.sideMessageQueue[messageBarStore.sideMessageQueue.length-i]"
                        @onDismissed="()=>messageBarStore.removeSideMessage(messageBarStore.sideMessageQueue[messageBarStore.sideMessageQueue.length-i])"/>
      </li>
    </ol>
  </div>
</template>
<script lang="ts">

import {defineComponent} from "vue";
import BaseMessageBar from "@/components/ui/BaseMessageBar.vue";
import {useMessageBarStore} from "@/stores/messageBarStore.js";

export default defineComponent({
  components: {BaseMessageBar},
  data() {
    return {};
  },
  setup() {
    return {messageBarStore: useMessageBarStore()};
  }
});
</script>
<style>
.message-bar-queue {

}

.side-message-list {
  position: fixed;
  right: 10px;
  transform: translateY(10px);
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  z-index: 100;
}
</style>
