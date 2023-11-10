<template>
  <div class="new-vocab-panel">
    <div class="top-sub-panel">
      <MeaningAddingControls
          :vocab-id="vocab.id"
          :vocab-text="vocab.text"
          :is-phrase="isPhrase"
          :suggested-meanings="suggestedMeanings"
          @onMeaningAdded="onMeaningAdded"/>

      <DictionariesList :vocab-text="vocab.text"/>
    </div>
    <div class="mark-buttons-div" v-if="!isPhrase && isLevelNew || isLevelIgnored">
      <button class="square-button hollow-button know-button" @click="markWordAsKnown">Mark as
        known
      </button>
      <button class="square-button hollow-button ignore-button" @click="markWordAsIgnored">Ignore
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import constants from "@/constants";
import MeaningAddingControls from "@/components/shared/vocab-panel/MeaningAddingControls.vue";
import DictionariesList from "@/components/shared/vocab-panel/DictionaryList.vue";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import {PropType} from "vue";
import {LearnerVocabSchema} from "dzelda-types";

export default {
  name: "NewVocabPanel",
  components: {MeaningAddingControls, DictionariesList},
  emits: ["onMeaningAdded", "onVocabLevelSet"],
  props: {
    vocab: {
      type: Object as PropType<LearnerVocabSchema>,
      required: true,
    },
    isPhrase: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {};
  },
  computed: {
    suggestedMeanings() {
      //TODO add button to show all meanings
      return this.vocab.meanings.filter((meaning) => !this.vocab.learnerMeanings.some((m) => m.id === meaning.id)).slice(0, 3);
    },
    isLevelNew() {
      return this.vocab.level === constants.ALL_VOCAB_LEVELS.NEW;
    },
    isLevelIgnored() {
      return this.vocab.level === constants.ALL_VOCAB_LEVELS.IGNORED;
    }
  },
  methods: {
    async markWordAsKnown() {
      await this.vocabStore.addVocabToUser({vocabId: this.vocab.id});
      await this.vocabStore.updateUserVocab(
          {vocabId: this.vocab.id},
          {level: constants.ALL_VOCAB_LEVELS.KNOWN}
      );
      this.$emit("onVocabLevelSet", constants.ALL_VOCAB_LEVELS.KNOWN);
    },
    async markWordAsIgnored() {
      await this.vocabStore.addVocabToUser({vocabId: this.vocab.id});
      await this.vocabStore.updateUserVocab(
          {vocabId: this.vocab.id},
          {level: constants.ALL_VOCAB_LEVELS.IGNORED}
      );
      this.$emit("onVocabLevelSet", constants.ALL_VOCAB_LEVELS.IGNORED);
    },
    onMeaningAdded(vocab, meaning) {
      this.$emit("onMeaningAdded", vocab, meaning);
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
