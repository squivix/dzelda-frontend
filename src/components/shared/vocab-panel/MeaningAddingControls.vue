<template>
  <div class="suggested-meanings-wrapper" v-if="suggestedMeanings.length>0">
    <h5>Suggested Meanings</h5>
    <ol class="suggested-meanings styled-scrollbars">
      <li v-for="meaning in suggestedMeanings" :key="meaning.id">
        <SubmitButton class="inv-button suggested-meaning"
                      @click="addSuggestedMeaning(meaning)">
          {{ meaning.text }}
        </SubmitButton>
      </li>
    </ol>
    <button v-if="shouldShowAllMeaningsButton&&!isShowingAllSuggestedMeanings" class="inv-button show-all-suggestions-button"
            @click="onShowAllSuggestionsClicked">
      <span>Show all suggestions</span>
    </button>
  </div>
  <form class="new-meaning-form" action="javascript:void(0);">
    <input ref="meaningTextInputRef" placeholder="Add new meaning here" v-model="newMeaningText"/>
    <SubmitButton class="new-meaning-button"
                  :isSubmitting="isSubmittingNewMeaning"
                  :keepText="false"
                  @click="addNewMeaning"
                  type="submit">
      <inline-svg :src="icons.plus"/>
    </SubmitButton>
  </form>
</template>

<script lang="ts">
import {useMeaningStore} from "@/stores/backend/meaningStore.js";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {LearnerVocabSchema, MeaningSchema} from "dzelda-common";
import {PropType} from "vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";

export default {
  name: "MeaningAddingControls",
  components: {SubmitButton, InlineSvg},
  emits: {
    onSuggestedMeaningClicked: (meaning: MeaningSchema) => true,
    onNewMeaningSubmitted: (newMeaningText: string) => true,
    onShowAllSuggestionsClicked: () => true,
  },
  props: {
    vocabId: {type: Number, required: false},
    vocabText: {type: String, required: true},
    vocabLanguage: {type: String, required: true},
    isPhrase: {type: Boolean, default: false},
    suggestedMeanings: {type: Array as PropType<MeaningSchema[]>, required: true},
    shouldShowAllMeaningsButton: {type: Boolean, default: false},
    isShowingAllSuggestedMeanings: {type: Boolean, default: false},
    isSubmittingNewMeaning: {type: Boolean, default: false},
  },
  data() {
    return {
      newMeaningText: "" as string | null,
    };
  },
  methods: {
    async addSuggestedMeaning(meaning: MeaningSchema) {
      this.$emit("onSuggestedMeaningClicked", meaning);
    },
    async addNewMeaning() {
      if (!this.newMeaningText)
        return;
      this.$emit("onNewMeaningSubmitted", this.newMeaningText);
    },
    onShowAllSuggestionsClicked() {
      this.$emit("onShowAllSuggestionsClicked");
    },
    focusNewMeaningInput() {
      (this.$refs["meaningTextInputRef"] as HTMLElement).focus();
    }
  },
  setup() {
    return {
      icons,
      vocabStore: useVocabStore(),
      meaningStore: useMeaningStore()
    };
  }
};
</script>

<style scoped>
.suggested-meanings-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
}

.suggested-meanings {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  overflow-y: auto;
  max-height: 200px;
  padding-right: 0.5rem;
}

.suggested-meaning {
  background-color: var(--primary-color);
  padding: 15px 10px;
  cursor: pointer;
  font-size: 1.15rem;
  color: var(--on-primary-color);
  border-radius: 5px;
  width: 100%;
  text-align: start;
  display: flex;
  justify-content: flex-start;
}

.show-all-suggestions-button span {
  padding-bottom: 0.25rem;
  font-weight: bold;
  color: var(--secondary-color);
  border-bottom: 3px solid var(--secondary-color);
}

.new-meaning-form {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: stretch;
  align-items: center;
  column-gap: 5px;
}

.new-meaning-form > input {
  flex-grow: 1;
  min-width: 100px;
}

.new-meaning-button {
  display: grid;
  place-items: center;
  width: 35px;
  height: 35px;
  background-color: #FFD263;
  border: 1px solid #FFD263;
  color: black;
  border-radius: 50%;
}

.new-meaning-button:hover {
  cursor: pointer;
}
</style>
