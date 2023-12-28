<template>
  <div class="side-panel">
    <MeaningPanel v-if="!selectedOverlappingPhrases"
                     :vocab="selectedVocab"
                     :is-phrase="selectedIsPhrase"
                     @click.stop
                     @onMeaningAdded="(vocabId, newMeaning)=>$emit('onMeaningAdded', vocabId, newMeaning)"
                     @onVocabLevelSet="(vocabId, level) =>$emit('onVocabLevelSet', vocabId, level)"
                     @onMeaningDeleted="(vocabId, deletedMeaning)=>$emit('onMeaningDeleted', vocabId, deletedMeaning)"
                     @onVocabNotesSet="(vocabId, notes)=>$emit('onVocabNotesSet', vocabId, notes)"
                     @onNewPhraseAdded="(vocab)=>$emit('onNewPhraseAdded', vocab)"
                     @onVocabRemovedFromUser="(removedVocab)=>$emit('onVocabRemovedFromUser', removedVocab)"/>
    <OverlappingPhrasesPanel v-else
                             @click.stop
                             :phrases="selectedOverlappingPhrases!"
                             @onPhraseClick="(phrase)=>$emit('onOverlappingPhraseClicked', phrase)"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import MeaningPanel from "@/components/shared/vocab-panel/MeaningPanel.vue";
import OverlappingPhrasesPanel from "@/components/page/reader/OverlappingPhrasesPanel.vue";
import {LearnerVocabSchema, MeaningSchema, VocabLevelSchema} from "dzelda-types";
import {NewVocab} from "@/pages/LessonReaderPage.vue";

export default defineComponent({
  name: "ReaderSidePanel",
  components: {OverlappingPhrasesPanel, MeaningPanel},
  props: {
    selectedOverlappingPhrases: {type: Array as PropType<LearnerVocabSchema[] | null>},
    selectedVocab: {type: Object as PropType<LearnerVocabSchema | NewVocab | null>},
    selectedIsPhrase: {type: Boolean},
  },
  computed: {},
  emits: {
    onMeaningAdded: (vocabId: number, newMeaning: MeaningSchema) => true,
    onMeaningDeleted: (vocabId: number, meaning: MeaningSchema) => true,
    onVocabLevelSet: (vocabId: number, level: VocabLevelSchema) => true,
    onVocabNotesSet: (vocabId: number, notes: string) => true,
    onNewPhraseAdded: (vocab: LearnerVocabSchema) => true,
    onVocabRemovedFromUser: (removedVocab: LearnerVocabSchema) => true,
    onOverlappingPhraseClicked: (phrase: LearnerVocabSchema) => true,
  },
});
</script>

<style scoped>
.side-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
