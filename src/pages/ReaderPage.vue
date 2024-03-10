<template>
  <Reader class="text-reader"
                :languageCode="pathParams.learningLanguage"
                :textId="pathParams.textId"/>
</template>
<script lang="ts">
import {useStore} from "@/stores/backend/rootStore.js";
import {defineComponent, PropType} from "vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import ReaderSidePanel from "@/components/page/reader/ReaderSidePanel.vue";
import {icons} from "@/icons.js";
import BaseCard from "@/components/ui/BaseCard.vue";
import PagePanelButton from "@/components/page/reader/PagePanelButton.vue";
import BasePageSelector from "@/components/ui/BasePageSelector.vue";
import PageIndicator from "@/components/page/reader/PageIndicator.vue";
import Reader from "@/components/shared/Reader.vue";

export default defineComponent({
  name: "ReaderPage",
  components: {Reader, PageIndicator, BasePageSelector, PagePanelButton, BaseCard, ReaderSidePanel, LoadingScreen},
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
