<template>
  <div>
    <template v-if="vocab">
      <h4 class="vocab-text">{{ vocab.text }}</h4>
      <div :class="{'meaning-sub-panel':true,'new-vocab-panel':showAddPanel, 'existing-vocab-panel':!showAddPanel}">
        <NewVocabPanel
            v-if="showAddPanel"
            :vocab="vocab"
            :is-phrase="isPhrase"
            @onMeaningAdded="onMeaningAdded"
            @onVocabLevelSet="onVocabLevelSet"
            @onNewPhraseAdded="onNewPhraseAdded">
        </NewVocabPanel>
        <ExistingVocabPanel
            v-else
            :vocab="existingVocab!"
            @onAddMoreMeaningsClicked="onAddMoreMeaningsClicked"
            @onMeaningDeleted="onMeaningDeleted"
            @onVocabRemovedFromUser="onVocabRemovedFromUser"
            @onVocabLevelSet="onVocabLevelSet"
            @onVocabNotesSet="onVocabNotesSet"
        >
        </ExistingVocabPanel>
      </div>
    </template>
    <slot name="no-selected-panel" v-else>

    </slot>
  </div>
</template>

<script lang="ts">
import NewVocabPanel from "@/components/shared/vocab-panel/NewVocabPanel.vue";
import ExistingVocabPanel from "@/components/shared/vocab-panel/ExistingVocabPanel.vue";
import {PropType} from "vue";
import {LearnerVocabSchema, MeaningSchema, VocabLevelSchema} from "dzelda-types";
import {NewVocab} from "@/pages/LessonReaderPage.vue";

export default {
  name: "TheMeaningPanel",
  components: {NewVocabPanel, ExistingVocabPanel},
  emits: ["onMeaningAdded", "onVocabLevelSet", "onMeaningDeleted", "onVocabNotesSet", "onNewPhraseAdded", "onVocabRemovedFromUser"],
  props: {
    vocab: {type: Object as PropType<LearnerVocabSchema | NewVocab | null>, required: false},
    isPhrase: {type: Boolean, default: false}
  },
  watch: {
    vocab() {
      this.addingMoreMeanings = false;
    }
  },
  data() {
    return {
      addingMoreMeanings: false
    };
  },
  computed: {
    isVocabNotSaved() {
      return [VocabLevelSchema.NEW, VocabLevelSchema.IGNORED, VocabLevelSchema.KNOWN].includes(this.vocab!.level!);
    },
    showAddPanel() {
      return this.isVocabNotSaved || this.addingMoreMeanings;
    },
    existingVocab(): LearnerVocabSchema | undefined {
      if (this.isVocabNotSaved)
        return undefined;
      else
        return this.vocab as LearnerVocabSchema;

    }
  },
  methods: {
    onAddMoreMeaningsClicked() {
      this.addingMoreMeanings = true;
    },
    onMeaningAdded(vocabId: number, newMeaning: MeaningSchema) {
      this.$emit("onMeaningAdded", vocabId, newMeaning);
      this.addingMoreMeanings = false;
    },
    onMeaningDeleted(meaning: MeaningSchema) {
      this.$emit("onMeaningDeleted", this.vocab, meaning);
    },
    onVocabRemovedFromUser(removedVocab:LearnerVocabSchema) {
      this.$emit("onVocabRemovedFromUser", removedVocab);
    },
    onVocabLevelSet(vocabId: number, level: VocabLevelSchema) {
      this.$emit("onVocabLevelSet", vocabId, level);
    },
    onVocabNotesSet(notes: string) {
      this.$emit("onVocabNotesSet", this.vocab, notes);
    },
    onNewPhraseAdded(vocab: LearnerVocabSchema) {
      this.$emit("onNewPhraseAdded", vocab);
    }
  },
};
</script>

<style scoped>

.meaning-panel-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.vocab-text {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.meaning-sub-panel {
  padding: 1vw;
  border-radius: 10px;
  flex-grow: 1;
}

.new-vocab-panel {
  background-color: #f0f9fe;
}

.existing-vocab-panel {
  background-color: #FFFCE9;
}
</style>
