<template>
  <div class="existing-vocab-panel">
    <MeaningEditingControls
        @onMeaningDeleted="onMeaningDeleted"
        @onMeaningEdited="onMeaningEdited"
        :vocab-id="vocab.id"
        :saved-meanings="vocab.learnerMeanings"/>

    <button class="capsule-button add-meaning-button" @click="addMeaning">
      <inline-svg :src="icons.plus" class="more-button"/>
    </button>

    <h5>Set Level</h5>
    <VocabLevelPicker
        :vocab="vocab"
        :level="vocab.level"
        @onVocabLevelSet="onVocabLevelSet"
        @onVocabRemovedFromUser="onVocabRemovedFromUser"
    />

    <textarea class="notes"
              placeholder="Notes"
              v-model="notes"
              @blur="updateVocabNotes"></textarea>
    <!--        TODO: Encounters with vocab button-->
  </div>
</template>

<script lang="ts">
import VocabLevelPicker from "@/components/shared/vocab-panel/VocabLevelPicker.vue";
import MeaningEditingControls from "@/components/shared/vocab-panel/MeaningEditingControls.vue";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import {PropType} from "vue";
import {LearnerVocabSchema, MeaningSchema, VocabLevelSchema} from "dzelda-common";

export default {
  name: "ExistingVocabPanel",
  components: {MeaningEditingControls, InlineSvg, VocabLevelPicker},
  emits: ["onAddMoreMeaningsClicked", "onMeaningDeleted", "onMeaningEdited", "onVocabLevelSet", "onVocabNotesSet", "onVocabRemovedFromUser"],
  data() {
    return {
      notes: this.vocab.notes
    };
  }, watch: {
    vocab() {
      this.notes = this.vocab.notes;
    }
  },
  props: {
    vocab: {type: Object as PropType<LearnerVocabSchema>, required: true},
  },
  methods: {
    addMeaning() {
      this.$emit("onAddMoreMeaningsClicked");
    },
    onMeaningEdited(meaning: MeaningSchema) {
      this.$emit("onMeaningEdited", meaning);
    },
    onMeaningDeleted(meaning: MeaningSchema) {
      this.$emit("onMeaningDeleted", meaning);
    },
    onVocabLevelSet(level: VocabLevelSchema) {
      this.$emit("onVocabLevelSet", this.vocab.id, level);
    },
    onVocabRemovedFromUser() {
      this.$emit("onVocabRemovedFromUser", this.vocab);
    },
    async updateVocabNotes() {
      await this.vocabStore.updateUserVocab(
          {vocabId: this.vocab.id},
          {notes: this.notes}
      );
      this.$emit("onVocabNotesSet", this.notes);
    }
  },
  setup() {
    return {
      icons,
      vocabStore: useVocabStore()
    };
  }
};
</script>

<style scoped>
.existing-vocab-panel {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.notes {
  resize: none;
  overflow: auto;
  height: 150px;
}

.add-meaning-button {
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  background-color: #FFD263;
  border: 1px solid #FFD263;
}

.add-meaning-button svg {
  color: black;
}
</style>
