<template>
  <div class="message-bar-queue">
    <ol>
      <li v-for="(message, index) in messageBarStore.messageQueue">
        <BaseMessageBar :text="message.text" :type="message.type"
                        @onDismissed="()=>messageBarStore.removeMessage(index)"/>
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
</style>
