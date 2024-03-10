<template>
  <div class="suggested-meanings-wrapper" v-if="suggestedMeanings.length>0">
    <h5>Suggested Meanings</h5>
    <ol class="suggested-meanings styled-scrollbars" ref="suggestedMeaningsRef">
      <li v-for="meaning in suggestedMeanings" :key="meaning.id">
        <button class="inv-button suggested-meaning"
                @click="addSuggestedMeaning(meaning)">
          <span>
            {{ meaning.text }}
          </span>
          <AttributionIcon :attribution="meaning.attribution" :attributionSource="meaning.attributionSource" :scrollOffsetPx="-suggestedMeaningsScrollPosition"/>
        </button>
      </li>
    </ol>
    <button v-if="shouldShowAllMeaningsButton&&!isShowingAllSuggestedMeanings"
            class="inv-button show-all-suggestions-button"
            @click="onShowAllSuggestionsClicked">
      <span>Show all suggestions</span>
    </button>
  </div>
  <form class="new-meaning-form" action="javascript:void(0);">
    <select v-model="newMeaningLanguage" v-if="preferredTranslationLanguages.length>1">
      <option v-for="translationLanguage in preferredTranslationLanguages" :value="translationLanguage.code">{{ translationLanguage.name }}</option>
    </select>
    <input ref="meaningTextInputRef" placeholder="Add new meaning here" maxlength="500" v-model="newMeaningText"/>
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
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {MeaningSchema} from "dzelda-common";
import {inject, onMounted, PropType, ref} from "vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import {renderMarkdown} from "@/utils.js";
import AttributionIcon from "@/components/ui/AttributionIcon.vue";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {useScroll} from "@vueuse/core";

export default {
  name: "MeaningAddingControls",
  components: {AttributionIcon, SubmitButton, InlineSvg},
  emits: {
    onSuggestedMeaningClicked: (meaning: MeaningSchema) => true,
    onNewMeaningSubmitted: (newMeaningText: string, newMeaningLanguage: string) => true,
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
      newMeaningLanguage: (this.languageStore as any as ReturnType<typeof useLanguageStore>).preferredTranslationLanguages![0].code,
    };
  },
  computed: {
    preferredTranslationLanguages() {
      return this.languageStore.preferredTranslationLanguages!;
    },
    // suggestedMeaningsScrollPosition() {
    //   // return useScroll(this.$refs["suggestedMeaningsRef"] as HTMLElement).y;
    // }
  },
  watch: {
    vocabId() {
      this.newMeaningText = "";
      this.newMeaningLanguage = this.preferredTranslationLanguages[0].code;
    },
  },
  methods: {
    async addSuggestedMeaning(meaning: MeaningSchema) {
      this.$emit("onSuggestedMeaningClicked", meaning);
    },
    async addNewMeaning() {
      if (!this.newMeaningText)
        return;
      this.$emit("onNewMeaningSubmitted", this.newMeaningText, this.newMeaningLanguage);
    },
    onShowAllSuggestionsClicked() {
      this.$emit("onShowAllSuggestionsClicked");
    },
    focusNewMeaningInput() {
      (this.$refs["meaningTextInputRef"] as HTMLElement).focus();
    }
  },
  setup() {
    const suggestedMeaningsRef = ref(null);
    const {y: suggestedMeaningsScrollPosition} = useScroll(suggestedMeaningsRef);

    return {
      icons,
      suggestedMeaningsRef,
      suggestedMeaningsScrollPosition,
      renderMarkdown: renderMarkdown,
      languageStore: inject<ReturnType<typeof useLanguageStore>>("languageStore", useLanguageStore()),
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

h5 {
  font-weight: bold;
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
  background-color: var(--meaning-item-color);
  padding: 15px 10px;
  min-height: 50px;
  cursor: pointer;
  font-size: 1.15rem;
  color: var(--on-primary-color);
  border-radius: 5px;
  width: 100%;
  text-align: start;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
