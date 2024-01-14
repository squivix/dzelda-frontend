<template>
  <div class="side-panel">
    <VocabPanel v-if="!selectedOverLappingPhrasesTokens"
                :vocab="selectedVocab"
                @mousedown.stop
                :onVocabRefetched="onVocabRefetched"
                @onVocabUpdated="(vocab, updatedData)=>$emit('onVocabUpdated',vocab, updatedData)"
                @onVocabDeleted="(vocab)=>$emit('onVocabDeleted',vocab)"
                @onNewVocabCreated="(vocab)=>$emit('onNewVocabCreated', vocab)"/>
    <OverlappingPhrasesPanel v-else
                             @mousedown.stop
                             :phrases="phrases"
                             :overLappingPhrasesTokens="selectedOverLappingPhrasesTokens!"
                             @onPhraseClick="(phraseTokens)=>$emit('onOverlappingPhraseClicked', phraseTokens)"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import OverlappingPhrasesPanel from "@/components/page/reader/OverlappingPhrasesPanel.vue";
import {LearnerVocabSchema} from "dzelda-common";
import {LessonTokenObject, NewVocab} from "@/pages/LessonReaderPage.vue";
import VocabPanel from "@/components/shared/vocab-panel/VocabPanel.vue";

export default defineComponent({
  name: "ReaderSidePanel",
  components: {OverlappingPhrasesPanel, VocabPanel},
  props: {
    selectedOverLappingPhrasesTokens: {type: Array as PropType<LessonTokenObject[][] | null>},
    selectedVocab: {type: Object as PropType<LearnerVocabSchema | NewVocab | null>, default: null},
    onVocabRefetched: {type: Function as PropType<(updatedVocab: LearnerVocabSchema) => void>},
    phrases: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true},
  },
  computed: {},
  emits: {
    onVocabUpdated: (vocab: LearnerVocabSchema, updatedData: Partial<LearnerVocabSchema>) => true,
    onVocabDeleted: (vocab: LearnerVocabSchema) => true,
    onNewVocabCreated: (vocab: LearnerVocabSchema) => true,
    onOverlappingPhraseClicked: (phraseTokens: LessonTokenObject[]) => true,
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
