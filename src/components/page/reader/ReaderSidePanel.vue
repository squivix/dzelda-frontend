<template>
  <div class="side-panel">
    <TheMeaningPanel v-if="!selectedOverlappingPhrases"
                     :vocab="selectedVocab"
                     :is-phrase="selectedIsPhrase"
                     @click.stop
                     @onMeaningAdded="onMeaningAdded"
                     @onVocabLevelSet="onVocabLevelSet"
                     @onMeaningDeleted="onMeaningDeleted"
                     @onVocabNotesSet="onVocabNotesSet"
                     @onNewPhraseAdded="onNewPhraseAdded"
                     @onVocabRemovedFromUser="onVocabRemovedFromUser"
    />
    <OverlappingPhrasesPanel v-else
                             @click.stop
                             :phrases="selectedOverlappingPhrases!"
                             @onPhraseClick="onOverlappingPhraseClicked"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import TheMeaningPanel from "@/components/shared/vocab-panel/TheMeaningPanel.vue";
import OverlappingPhrasesPanel from "@/components/page/reader/OverlappingPhrasesPanel.vue";
import {LearnerVocabSchema, MeaningSchema, VocabLevelSchema} from "dzelda-types";
import {NewVocab} from "@/pages/LessonReaderPage.vue";

export default defineComponent({
  name: "ReaderSidePanel",
  components: {OverlappingPhrasesPanel, TheMeaningPanel},
  props: {
    selectedOverlappingPhrases: {type: Array as PropType<LearnerVocabSchema[] | null>},
    selectedVocab: {type: Object as PropType<LearnerVocabSchema | NewVocab | null>},
    selectedIsPhrase: {type: Boolean},
  },
  computed: {},
  emits: ["onMeaningAdded", "onVocabLevelSet", "onMeaningDeleted", "onOverlappingPhraseClicked", "onVocabNotesSet", "onNewPhraseAdded", "onVocabRemovedFromUser"],
  methods: {
    onOverlappingPhraseClicked(phrase: LearnerVocabSchema) {
      this.$emit("onOverlappingPhraseClicked", phrase);
    },
    onMeaningAdded(vocabId: number, newMeaning: MeaningSchema) {
      this.$emit("onMeaningAdded", vocabId, newMeaning);
    },
    onVocabLevelSet(vocabId: number, level: VocabLevelSchema) {
      this.$emit("onVocabLevelSet", vocabId, level);
    },
    onMeaningDeleted(word: LearnerVocabSchema, deletedMeaning: MeaningSchema) {
      this.$emit("onMeaningDeleted", word, deletedMeaning);
    },
    onVocabNotesSet(vocab: LearnerVocabSchema, notes: string) {
      this.$emit("onVocabNotesSet", vocab, notes);
    },
    onVocabRemovedFromUser(removedVocab:LearnerVocabSchema) {
      this.$emit("onVocabRemovedFromUser",removedVocab);
    },
    onNewPhraseAdded(vocab: LearnerVocabSchema) {
      this.$emit("onNewPhraseAdded", vocab);
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
