<template>
  <Reader class="text-reader"
          :languageCode="pathParams.learningLanguage"
          :textId="pathParams.textId"/>
</template>
<script lang="ts">
import {useStore} from "@/stores/backend/rootStore.js";
import {defineComponent, PropType} from "vue";
import {icons} from "@/icons.js";
import Reader from "@/components/shared/Reader.vue";

export default defineComponent({
  name: "ReaderPage",
  components: {Reader},
  props: {
    pathParams: {type: Object as PropType<{ learningLanguage: string, textId: number }>, required: true},
  },
  setup() {
    return {
      icons,
      store: useStore(),
    };
  }
});
</script>
<style scoped>
.text-reader {
  width: 90vw;
}
</style>
