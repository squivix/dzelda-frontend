<template>
  <div class="new-vocab-panel">
    <div class="top-sub-panel">
      <MeaningAddingControls :vocabId="(vocab as any).id as number|undefined"
                             :vocabText="vocab.text"
                             :vocabLanguage="vocab.language"
                             :isPhrase="vocab.isPhrase"
                             :suggestedMeanings="suggestedMeaningsSegment"
                             :shouldShowAllMeaningsButton="suggestedMeanings.length>3"
                             :isShowingAllSuggestedMeanings="isShowingAllSuggestedMeanings"
                             :isSubmittingNewMeaning="isSubmittingNewMeaning"
                             @onSuggestedMeaningClicked="(newMeaning)=>$emit('onSuggestedMeaningClicked',newMeaning)"
                             @onNewMeaningSubmitted="(newMeaningText)=>$emit('onNewMeaningSubmitted', newMeaningText)"
                             @onShowAllSuggestionsClicked="()=>isShowingAllSuggestedMeanings=true"/>
      <DictionariesList :vocabText="vocab.text" :languageCode="vocab.language"/>
    </div>
    <div class="mark-buttons-div" v-if="!vocab.isPhrase && isLevelNew || isLevelIgnored||isLevelKnown">
      <button class="square-button hollow-button know-button" @click="$emit('onMarkAsKnownClicked')">Mark as
        known
      </button>
      <button class="square-button hollow-button ignore-button" @click="$emit('onMarkAsIgnoredClicked')">Ignore
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import MeaningAddingControls from "@/components/shared/vocab-panel/MeaningAddingControls.vue";
import DictionariesList from "@/components/shared/vocab-panel/DictionaryList.vue";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import {PropType} from "vue";
import {LearnerVocabSchema, MeaningSchema, VocabLevelSchema} from "dzelda-common";
import {NewVocab} from "@/pages/LessonReaderPage.vue";

export default {
  name: "NewVocabPanel",
  components: {MeaningAddingControls, DictionariesList},
  emits: {
    onSuggestedMeaningClicked: (meaning: MeaningSchema) => true,
    onNewMeaningSubmitted: (newMeaningText: string) => true,
    onMarkAsKnownClicked: () => true,
    onMarkAsIgnoredClicked: () => true,
  },
  props: {
    vocab: {type: Object as PropType<LearnerVocabSchema | NewVocab>, required: true,},
    isSubmittingNewMeaning: {type: Boolean, default: false},
  },
  data() {
    return {
      isShowingAllSuggestedMeanings: false,
    };
  },
  computed: {
    suggestedMeanings() {
      return this.vocab.meanings.filter((meaning) => !this.vocab.learnerMeanings.some((m) => m.id === meaning.id));
    },
    suggestedMeaningsSegment() {
      if (this.isShowingAllSuggestedMeanings)
        return this.suggestedMeanings;
      else
        return this.suggestedMeanings.slice(0, 3);
    },
    isLevelNew() {
      return this.vocab.level === VocabLevelSchema.NEW;
    },
    isLevelIgnored() {
      return this.vocab.level === VocabLevelSchema.IGNORED;
    },
    isLevelKnown() {
      return this.vocab.level === VocabLevelSchema.KNOWN;
    },
  },
  setup() {
    return {vocabStore: useVocabStore()};
  }
};
</script>

<style scoped>
.new-vocab-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 1rem;
  height: 100%;
}

.top-sub-panel {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;

}

.mark-buttons-div {
  display: flex;
  flex-direction: row;
  justify-content: center;
  justify-self: flex-end;
  margin-bottom: 0.25rem;
}

.ignore-button {
  color: grey;
  border: none;
  flex-grow: 1;
}

.know-button {
  color: var(--primary-color);
  border: none;
  flex-grow: 1;
}
</style>
