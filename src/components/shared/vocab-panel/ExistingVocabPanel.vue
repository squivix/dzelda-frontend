<template>
  <div class="existing-vocab-panel">
    <MeaningEditingControls
        @onMeaningEditSubmitted="onMeaningEditSubmitted"
        @onMeaningDeleteClicked="onMeaningDeleteClicked"
        :isSubmittingEditMeaningSet="isSubmittingEditMeaningSet"
        :vocab-id="vocab.id"
        :savedMeanings="vocab.learnerMeanings"/>

    <button class="big-button capsule-button add-meaning-button" @click="addMeaning">
      <inline-svg :src="icons.plus" class="more-button"/>
    </button>

    <h5>Set Level</h5>
    <VocabLevelPicker :vocab="vocab"
                      :level="vocab.level"
                      @onVocabLevelButtonClicked="onVocabLevelButtonClicked"/>

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
import {PropType} from "vue";
import {LearnerVocabSchema, MeaningSchema, VocabLevelSchema} from "dzelda-common";

export default {
  name: "ExistingVocabPanel",
  components: {MeaningEditingControls, InlineSvg, VocabLevelPicker},
  emits: ["onAddMoreMeaningsClicked", "onMeaningDeleteClicked", "onMeaningEditSubmitted", "onVocabLevelButtonClicked", "onVocabNotesEditSubmitted"],
  props: {
    vocab: {type: Object as PropType<LearnerVocabSchema>, required: true},
    isSubmittingEditMeaningSet: {type: Object as PropType<Set<number>>, required: true}
  },
  data() {
    return {
      notes: this.vocab.notes ?? ""
    };
  },
  watch: {
    vocab() {
      this.notes = this.vocab.notes ?? "";
    }
  },
  methods: {
    addMeaning() {
      this.$emit("onAddMoreMeaningsClicked");
    },
    onMeaningEditSubmitted(meaning: MeaningSchema, newMeaningText: string, newMeaningLang: string) {
      this.$emit("onMeaningEditSubmitted", meaning, newMeaningText, newMeaningLang);
    },
    onMeaningDeleteClicked(meaning: MeaningSchema) {
      this.$emit("onMeaningDeleteClicked", meaning);
    },
    onVocabLevelButtonClicked(level: VocabLevelSchema) {
      this.$emit("onVocabLevelButtonClicked", level);
    },
    updateVocabNotes() {
      if (this.notes == this.vocab.notes)
        return;
      this.$emit("onVocabNotesEditSubmitted", this.vocab, this.notes);
    }
  },
  setup() {
    return {
      icons,
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
  border: none;
}

.add-meaning-button svg {
  color: black;
}
</style>
