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
                             @onNewMeaningSubmitted="(newMeaningText,newMeaningLanguage)=>$emit('onNewMeaningSubmitted', newMeaningText, newMeaningLanguage)"
                             @onShowAllSuggestionsClicked="()=>isShowingAllSuggestedMeanings=true"/>
      <DictionariesList :vocabText="vocab.text" :languageCode="vocab.language"/>
    </div>
    <div class="mark-buttons-div"
         v-if="!vocab.isPhrase && isLevelNew || isLevelIgnored||isLevelKnown">
      <button class="square-button hollow-button know-button"
              @click="$emit('onMarkAsKnownClicked')">Mark as
        known
      </button>
      <button class="square-button hollow-button ignore-button" @click="$emit('onIgnoreClicked')">
        Ignore
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import MeaningAddingControls from "@/components/shared/vocab-panel/MeaningAddingControls.vue";
import DictionariesList from "@/components/shared/vocab-panel/DictionaryList.vue";
import type {PropType} from "vue";
import type {LearnerVocabSchema, MeaningSchema} from "dzelda-common";
import {VocabLevel} from "dzelda-common";
import type {NewVocab} from "@/components/shared/Reader.vue";

export default {
  name: "NewVocabPanel",
  components: {MeaningAddingControls, DictionariesList},
  emits: {
    onSuggestedMeaningClicked: (meaning: MeaningSchema) => true,
    onNewMeaningSubmitted: (newMeaningText: string, newMeaningLanguage: string) => true,
    onMarkAsKnownClicked: () => true,
    onIgnoreClicked: () => true,
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
      return this.vocab.level === VocabLevel.NEW;
    },
    isLevelIgnored() {
      return this.vocab.level === VocabLevel.IGNORED;
    },
    isLevelKnown() {
      return this.vocab.level === VocabLevel.KNOWN;
    },
  },
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
