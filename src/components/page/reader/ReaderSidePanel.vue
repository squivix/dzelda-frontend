<template>
  <div class="side-panel" @mousedown.stop>
    <VocabPanel v-if="selectedVocab"
                :vocab="selectedVocab"
                :unnormalizedText="selectedUnparsedText"
                @mousedown.stop
                @onVocabUpdated="(vocab, updatedData)=>$emit('onVocabUpdated',vocab, updatedData)"
                @onVocabDeleted="(vocab)=>$emit('onVocabDeleted',vocab)"
                @onNewVocabCreated="(vocab)=>$emit('onNewVocabCreated', vocab)"
                :onVocabRefetched="onVocabRefetched"/>
    <OverlappingPhrasesPanel v-else-if="selectedOverLappingPhrasesTokens"
                             @mousedown.stop
                             :phrases="phrases"
                             :overLappingPhrasesTokens="selectedOverLappingPhrasesTokens!"
                             @onPhraseClick="(phraseTokens)=>$emit('onOverlappingPhraseClicked', phraseTokens)"/>
    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import OverlappingPhrasesPanel from "@/components/page/reader/OverlappingPhrasesPanel.vue";
import {LearnerVocabSchema} from "dzelda-common";
import {TextTokenObject, NewVocab} from "@/components/shared/Reader.vue";
import VocabPanel from "@/components/shared/vocab-panel/VocabPanel.vue";

export default defineComponent({
  name: "ReaderSidePanel",
  components: {OverlappingPhrasesPanel, VocabPanel},
  props: {
    selectedOverLappingPhrasesTokens: {type: Array as PropType<TextTokenObject[][] | null>},
    selectedVocab: {type: Object as PropType<LearnerVocabSchema | NewVocab | null>, default: null},
    selectedUnparsedText: {type: String as PropType<string >},
    onVocabRefetched: {type: Function as PropType<(updatedVocab: LearnerVocabSchema) => void>},
    phrases: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true},
  },
  computed: {},
  emits: {
    onVocabUpdated: (vocab: LearnerVocabSchema, updatedData: Partial<LearnerVocabSchema>) => true,
    onVocabDeleted: (vocab: LearnerVocabSchema) => true,
    onNewVocabCreated: (vocab: LearnerVocabSchema) => true,
    onOverlappingPhraseClicked: (phraseTokens: TextTokenObject[]) => true,
  },
});
</script>

<style scoped>
.side-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 30px;
  padding-right: 15px;
}
</style>
