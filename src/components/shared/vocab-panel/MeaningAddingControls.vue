<template>
  <div class="suggested-meanings-div" v-if="suggestedMeanings.length>0">
    <h5>Suggested Meanings</h5>
    <ol class="suggested-meanings styled-scrollbars">
      <li v-for="meaning in suggestedMeanings" :key="meaning.id" @click="addSuggestedMeaning(meaning)">
        {{ meaning.text }}
      </li>
    </ol>
  </div>

  <form class="new-meaning-form" action="javascript:void(0);">
    <input placeholder="Add new meaning here" v-model="newMeaning"/>
    <button class="new-meaning-button"
            @click="addNewMeaning"
            type="submit">
      <inline-svg :src="icons.plus"/>
    </button>
  </form>
</template>

<script lang="ts">
import {useMeaningStore} from "@/stores/backend/meaningStore.js";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {LearnerVocabSchema, MeaningSchema} from "dzelda-common";
import {PropType} from "vue";

export default {
  name: "MeaningAddingControls",
  components: {InlineSvg},
  emits: {
    onMeaningAdded: (vocabId: number, meaning: MeaningSchema) => true,
    onNewPhraseAdded: (vocab: LearnerVocabSchema) => true,
  },
  props: {
    vocabId: {type: Number, required: false},
    vocabText: {type: String, required: true},
    vocabLanguage: {type: String, required: true},
    isPhrase: {type: Boolean, default: false},
    suggestedMeanings: {type: Array as PropType<MeaningSchema[]>, required: true}
  },
  data() {
    return {
      newMeaning: "" as string | null,
    };
  },
  methods: {
    async addSuggestedMeaning(meaning: MeaningSchema) {
      const newVocab = await this.vocabStore.addVocabToUser({vocabId: this.vocabId!});
      await this.meaningStore.addMeaningToUser({meaningId: meaning.id});
      this.$emit("onMeaningAdded", newVocab.id, meaning);
    },
    async addNewMeaning() {
      if (!this.newMeaning)
        return;
      let vocabId = this.vocabId;
      if (this.isPhrase && !this.vocabId) {
        const vocab = await this.vocabStore.createVocab({
          text: this.vocabText,
          languageCode: this.vocabLanguage,
          isPhrase: true,
        });
        vocabId = vocab.id;
      }

      const newVocab = await this.vocabStore.addVocabToUser({vocabId: vocabId!});
      if (this.isPhrase)
        this.$emit("onNewPhraseAdded", newVocab);

      const newMeaning = await this.meaningStore.createMeaning({
        text: this.newMeaning,
        vocabId: vocabId!,
        //TODO: no language hard-coding
        languageCode: "en",
      });
      await this.meaningStore.addMeaningToUser({meaningId: newMeaning.id});
      this.$emit("onMeaningAdded", vocabId!, newMeaning);
      this.newMeaning = "";
    }
    ,
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
.suggested-meanings-div {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.suggested-meanings {
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  overflow-y: auto;
  max-height: 20vh;
  padding-right: 0.5rem;
}

.suggested-meanings > li {
  background-color: var(--primary-color);
  padding: 15px 10px;
  cursor: pointer;
  font-size: 1.15rem;
  color: var(--on-primary-color);
  border-radius: 5px;
  width: 100%;
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
  width: 40px;
  height: 40px;
  background-color: #FFD263;
  border: 1px solid #FFD263;
  color: black;
  border-radius: 50%;
}

.new-meaning-button:hover {
  cursor: pointer;
}
</style>
