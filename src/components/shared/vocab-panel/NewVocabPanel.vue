<template>
  <div class="new-vocab-panel">
    <div class="top-sub-panel">
      <MeaningAddingControls
          :vocabId="vocab.id"
          :vocabText="vocab.text"
          :vocabLanguage="vocab.language"
          :isPhrase="isPhrase"
          :suggestedMeanings="suggestedMeanings"
          @onMeaningAdded="onMeaningAdded"
          @onNewPhraseAdded="onNewPhraseAdded"
      />

      <DictionariesList :vocabText="vocab.text"/>
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
    onMeaningAdded: (vocabId: number, newMeaning: MeaningSchema) => true,
    onVocabLevelSet: (vocabId: number, level: VocabLevelSchema) => true,
    onNewPhraseAdded: (vocab: LearnerVocabSchema) => true,
  },
  props: {
    vocab: {
      type: Object as PropType<LearnerVocabSchema | NewVocab>,
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
      return this.vocab.level === VocabLevelSchema.NEW;
    },
    isLevelIgnored() {
      return this.vocab.level === VocabLevelSchema.IGNORED;
    }
  },
  methods: {
    async markWordAsKnown() {
      const vocab = this.vocab as LearnerVocabSchema;
      await this.vocabStore.addVocabToUser({vocabId: vocab.id});
      await this.vocabStore.updateUserVocab(
          {vocabId: vocab.id},
          {level: VocabLevelSchema.KNOWN}
      );
      this.$emit("onVocabLevelSet", vocab.id, VocabLevelSchema.KNOWN);
    },
    async markWordAsIgnored() {
      const vocab = this.vocab as LearnerVocabSchema;
      await this.vocabStore.addVocabToUser({vocabId: vocab.id});
      await this.vocabStore.updateUserVocab(
          {vocabId: vocab.id},
          {level: VocabLevelSchema.IGNORED}
      );
      this.$emit("onVocabLevelSet", vocab.id, VocabLevelSchema.IGNORED);
    },
    onMeaningAdded(vocabId: number, newMeaning: MeaningSchema) {
      this.$emit("onMeaningAdded", vocabId, newMeaning);
    },
    onNewPhraseAdded(vocab: LearnerVocabSchema) {
      this.$emit("onNewPhraseAdded", vocab);
    }
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
