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
            @onVocabLevelSet="onVocabLevelSet">
        </NewVocabPanel>
        <ExistingVocabPanel
            v-else
            :vocab="vocab"
            @onAddMoreMeaningsClicked="onAddMoreMeaningsClicked"
            @onMeaningDeleted="onMeaningDeleted"
            @onVocabLevelSet="onVocabLevelSet"
            @onVocabNotesSet="onVocabNotesSet">
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
  emits: ["onMeaningAdded", "onVocabLevelSet", "onMeaningDeleted", "onVocabNotesSet"],
  props: {
    vocab: {
      type: Object as PropType<LearnerVocabSchema | NewVocab | null>,
      required: false,
    },
    isPhrase: {
      type: Boolean,
      required: false,
      default: false,
    }
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
    }
  },
  methods: {
    onAddMoreMeaningsClicked() {
      this.addingMoreMeanings = true;
    },
    onMeaningAdded(vocab: LearnerVocabSchema, meaning: MeaningSchema) {
      this.$emit("onMeaningAdded", vocab, meaning);
      this.addingMoreMeanings = false;
    },
    onMeaningDeleted(meaning: MeaningSchema) {
      this.$emit("onMeaningDeleted", this.vocab, meaning);
    },
    onVocabLevelSet(level: VocabLevelSchema) {
      this.$emit("onVocabLevelSet", this.vocab, level);
    },
    onVocabNotesSet(notes: string) {
      this.$emit("onVocabNotesSet", this.vocab, notes);
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
