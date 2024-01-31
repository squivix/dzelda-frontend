<template>
  <div>
    <template v-if="vocab">
      <VocabPanelTopBar :vocab="vocab" :hidePreferredTTS="showPronunciationPanel" @onPronunciationButtonClicked="showPronunciationPanel=!showPronunciationPanel"/>
      <div :class="{'meaning-sub-panel':true,'new-vocab-panel':showAddPanel, 'existing-vocab-panel':!showAddPanel, 'pronunciation-panel':showPronunciationPanel}">
        <PronunciationPanel v-if="showPronunciationPanel" :vocab="vocab"/>
        <NewVocabPanel v-else-if="showAddPanel"
                       :vocab="vocab"
                       :isPhrase="vocab.isPhrase"
                       :isSubmittingNewMeaning="isSubmittingNewMeaning"
                       @onSuggestedMeaningClicked="addSuggestedMeaning"
                       @onNewMeaningSubmitted="addNewMeaning"
                       @onMarkAsKnownClicked="()=>onMarkAsButtonClicked(VocabLevelSchema.KNOWN)"
                       @onMarkAsIgnoredClicked="()=>onMarkAsButtonClicked(VocabLevelSchema.IGNORED)"/>
        <ExistingVocabPanel v-else
                            :vocab="existingVocab!"
                            :isSubmittingEditMeaningSet="isSubmittingEditMeaningSet"
                            @onAddMoreMeaningsClicked="onAddMoreMeaningsClicked"
                            @onVocabLevelButtonClicked="updateVocabLevel"
                            @onVocabNotesEditSubmitted="updateVocabNotes"
                            @onMeaningEditSubmitted="updateMeaning"
                            @onMeaningDeleteClicked="deleteMeaning"/>
      </div>
    </template>
    <slot name="no-selected-panel" v-else>

    </slot>
  </div>
</template>

<script lang="ts">
import NewVocabPanel from "@/components/shared/vocab-panel/NewVocabPanel.vue";
import ExistingVocabPanel from "@/components/shared/vocab-panel/ExistingVocabPanel.vue";
import {inject, PropType} from "vue";
import {LearnerVocabSchema, MeaningSchema, VocabLevelSchema} from "dzelda-common";
import {useMeaningStore} from "@/stores/backend/meaningStore.js";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import MeaningEditingControls from "@/components/shared/vocab-panel/MeaningEditingControls.vue";
import {NewVocab} from "@/components/shared/LessonReader.vue";
import InlineSvg from "vue-inline-svg";
import VocabPanelTopBar from "@/components/shared/vocab-panel/VocabPanelTopBar.vue";
import PronunciationPanel from "@/components/shared/vocab-panel/PronunciationPanel.vue";

export default {
  name: "VocabPanel",
  components: {PronunciationPanel, VocabPanelTopBar, MeaningEditingControls, NewVocabPanel, ExistingVocabPanel, InlineSvg},
  emits: {
    onNewVocabCreated: (vocab: LearnerVocabSchema) => true,
    onVocabUpdated: (vocab: LearnerVocabSchema, updatedData: Partial<LearnerVocabSchema>) => true,
    onVocabDeleted: (vocab: LearnerVocabSchema) => true,
  },
  props: {
    vocab: {type: Object as PropType<LearnerVocabSchema | NewVocab | null>, default: null},
    onVocabRefetched: {type: Function as PropType<(updatedVocab: LearnerVocabSchema) => void>},
  },
  data() {
    return {
      showPronunciationPanel: false,
      addingMoreMeanings: false,
      isSubmittingNewMeaning: false,
      isSubmittingEditMeaningSet: new Set<number>(),
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
  watch: {
    vocab() {
      this.addingMoreMeanings = false;
    }
  },
  methods: {
    onAddMoreMeaningsClicked() {
      this.addingMoreMeanings = true;
    },
    onMarkAsButtonClicked(level: VocabLevelSchema) {
      const vocab = this.vocab as LearnerVocabSchema;
      this.vocabStore.addVocabToUser({vocabId: vocab.id, level});
      this.$emit("onVocabUpdated", this.vocab as LearnerVocabSchema, {level});
    },
    updateVocabLevel(level: VocabLevelSchema) {
      const vocab = this.vocab as LearnerVocabSchema;
      if (level == VocabLevelSchema.IGNORED && vocab.isPhrase) {
        this.vocabStore.removeVocabFromUser({vocabId: vocab.id});
        this.$emit("onVocabDeleted", vocab);
      } else {
        this.vocabStore.updateUserVocab({vocabId: vocab.id}, {level: level});
        if (level == VocabLevelSchema.IGNORED)
          this.$emit("onVocabUpdated", vocab, {level, learnerMeanings: []});
        else
          this.$emit("onVocabUpdated", vocab, {level});
      }
    },
    updateVocabNotes(vocab: LearnerVocabSchema, newNotesText: string) {
      this.vocabStore.updateUserVocab({vocabId: vocab.id}, {notes: newNotesText});
      this.$emit("onVocabUpdated", vocab, {notes: newNotesText});
    },
    addSuggestedMeaning(meaning: MeaningSchema) {
      if (!this.vocab)
        return;
      const vocab = this.vocab as LearnerVocabSchema;
      this.vocabStore.addVocabToUser({vocabId: vocab.id});
      this.meaningStore.addMeaningToUser({meaningId: meaning.id});
      this.$emit("onVocabUpdated", vocab, {
        level: [VocabLevelSchema.NEW, VocabLevelSchema.LEARNED, VocabLevelSchema.KNOWN, VocabLevelSchema.IGNORED].includes(vocab.level) ? VocabLevelSchema.LEVEL1 : vocab.level,
        learnerMeanings: [...vocab.learnerMeanings, meaning],
      });
      this.addingMoreMeanings = false;
    },
    async addNewMeaning(newMeaningText: string) {
      if (!this.vocab)
        return;
      let newVocab: LearnerVocabSchema;
      this.isSubmittingNewMeaning = true;
      if (!("id" in this.vocab)) {
        const vocab = await this.vocabStore.createVocab({
          text: this.vocab.text,
          languageCode: this.vocab.language,
          isPhrase: this.vocab.isPhrase,
        });
        newVocab = await this.vocabStore.addVocabToUser({vocabId: vocab.id});
        this.$emit("onNewVocabCreated", newVocab);
      } else if (this.vocab.level == VocabLevelSchema.NEW)
        newVocab = await this.vocabStore.addVocabToUser({vocabId: this.vocab.id});
      else
        newVocab = this.vocab;
      const newMeaning = await this.meaningStore.createMeaning({
        text: newMeaningText,
        vocabId: newVocab.id,
        //TODO: no language hard-coding
        languageCode: "en",
      });
      await this.meaningStore.addMeaningToUser({meaningId: newMeaning.id});

      if (this.onVocabRefetched) {
        newVocab = await this.vocabStore.fetchUserVocab({vocabId: newVocab.id});
        this.isSubmittingNewMeaning = false;
        this.onVocabRefetched(newVocab);
      }
      this.addingMoreMeanings = false;
    },
    updateMeaning(meaning: MeaningSchema, newMeaningText: string) {
      const vocab = this.vocab as LearnerVocabSchema;
      this.isSubmittingEditMeaningSet.add(meaning.id);
      this.meaningStore.deleteMeaningFromUser({meaningId: meaning.id});
      this.meaningStore.createMeaning({
        vocabId: vocab.id,
        languageCode: "en",
        text: newMeaningText,
      }).then((newMeaning) => {
        this.meaningStore.addMeaningToUser({meaningId: newMeaning.id}).then(() => {
          this.vocabStore.fetchUserVocab({vocabId: vocab.id}).then(updatedVocab => {
            if (this.onVocabRefetched)
              this.onVocabRefetched(updatedVocab);
            this.isSubmittingEditMeaningSet.delete(meaning.id);
          });
        });
      });
    },
    deleteMeaning(meaning: MeaningSchema) {
      const vocab = this.vocab as LearnerVocabSchema;
      this.meaningStore.deleteMeaningFromUser({meaningId: meaning.id});
      this.$emit("onVocabUpdated", vocab, {learnerMeanings: vocab.learnerMeanings.filter(m => m.id !== meaning.id)});
    },
  },
  setup() {
    return {
      VocabLevelSchema,
      meaningStore: inject<ReturnType<typeof useMeaningStore>>("meaningStore", useMeaningStore()),
      vocabStore: inject<ReturnType<typeof useVocabStore>>("vocabStore", useVocabStore()),
    };
  }
};
</script>

<style scoped>
.meaning-sub-panel {
  padding: 1vw;
  border-radius: 10px;
  flex-grow: 1;
}

.new-vocab-panel {
  background-color: var(--primary-faint-color);
  color: var(--panel-new-text-color);
}

.existing-vocab-panel {
  background-color: var(--saved-vocab-panel-color);
}

.pronunciation-panel {
  background-color: var(--primary-faint-color);
  color: var(--panel-new-text-color);
}
</style>
