<template>
  <LessonReader class="lesson-reader"
                :languageCode="pathParams.learningLanguage"
                :lessonId="pathParams.lessonId"/>
</template>
<script lang="ts">
import LessonContent from "@/components/page/reader/LessonContent.vue";
import {useStore} from "@/stores/backend/rootStore.js";
import {defineComponent, PropType} from "vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import ReaderSidePanel from "@/components/page/reader/ReaderSidePanel.vue";
import {icons} from "@/icons.js";
import BaseCard from "@/components/ui/BaseCard.vue";
import ExpandingIconButton from "@/components/ui/ExpandingIconButton.vue";
import PagePanelButton from "@/components/page/reader/PagePanelButton.vue";
import BasePageSelector from "@/components/ui/BasePageSelector.vue";
import PageIndicator from "@/components/page/reader/PageIndicator.vue";
import LessonReader from "@/components/shared/LessonReader.vue";

export default defineComponent({
  name: "LessonReaderPage",
  components: {LessonReader, PageIndicator, BasePageSelector, PagePanelButton, ExpandingIconButton, BaseCard, ReaderSidePanel, LoadingScreen, LessonContent},
  props: {
    pathParams: {type: Object as PropType<{ learningLanguage: string, lessonId: number }>, required: true},
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
.lesson-reader {
  width: 90vw;
}
</style>
