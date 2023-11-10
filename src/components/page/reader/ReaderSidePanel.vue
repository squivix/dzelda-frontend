<template>
  <div class="side-panel">
    <TheMeaningPanel v-if="!selectedOverlappingPhrases"
                     :vocab="selectedVocab"
                     :is-phrase="selectedIsPhrase"
                     @onMeaningAdded="onMeaningAdded"
                     @onVocabLevelSet="onVocabLevelSet"
                     @onMeaningDeleted="onMeaningDeleted"
                     @onVocabNotesSet="onVocabNotesSet">
    </TheMeaningPanel>
    <OverlappingPhrasesPanel v-else
                             :phrases="selectedOverlappingPhrases"
                             @onPhraseClick="onOverlappingPhraseClicked">
    </OverlappingPhrasesPanel>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import TheMeaningPanel from "@/components/shared/vocab-panel/TheMeaningPanel.vue";
import OverlappingPhrasesPanel from "@/components/page/reader/OverlappingPhrasesPanel.vue";
import {LearnerVocabSchema, MeaningSchema, VocabLevelSchema} from "dzelda-types";
import {NewVocab} from "@/pages/LessonReaderPage.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";

export default defineComponent({
  name: "ReaderSidePanel",
  components: {OverlappingPhrasesPanel, TheMeaningPanel, InlineSvg},
  props: {
    selectedOverlappingPhrases: {type: Array as PropType<string[] | null>},
    selectedVocab: {type: Object as PropType<LearnerVocabSchema | null>},
    selectedIsPhrase: {type: Boolean},
  },
  computed: {},
  emits: ["onMeaningAdded", "onVocabLevelSet", "onVocabLevelSet", "onMeaningDeleted", "onOverlappingPhraseClicked", "onVocabNotesSet"],
  methods: {
    onOverlappingPhraseClicked(vocabText: string) {
      this.$emit("onOverlappingPhraseClicked", vocabText);
    },
    onMeaningAdded(vocab: LearnerVocabSchema, newMeaning: MeaningSchema) {
      this.$emit("onMeaningAdded", vocab, newMeaning);
    },
    onVocabLevelSet(vocab: LearnerVocabSchema | NewVocab, level: VocabLevelSchema) {
      this.$emit("onVocabLevelSet", vocab, level);
    },
    onMeaningDeleted(word: LearnerVocabSchema, deletedMeaning: MeaningSchema) {
      this.$emit("onMeaningDeleted", word, deletedMeaning);
    },
    onVocabNotesSet(vocab: LearnerVocabSchema, notes: string) {
      this.$emit("onVocabNotesSet", vocab, notes);
    }
  },
  setup() {
    return {};
  }
});
</script>

<style scoped>
.side-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}


</style>
