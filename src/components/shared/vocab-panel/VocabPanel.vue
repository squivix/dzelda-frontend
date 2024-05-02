<template>
  <div>
    <template v-if="vocab">
      <VocabPanelTopBar :vocab="vocab"
                        :isPronunciationPanelShown="isPronunciationPanelShown"
                        @onPronunciationButtonClicked="isPronunciationPanelShown=!isPronunciationPanelShown"
                        :isGeneratingTTS="isGeneratingTTS"
                        @onGenerateTTSButtonClicked="onGenerateTTSButtonClicked"/>
      <div class="tags">
        <span class="root-form" v-if="tagsAndRootForms!.length>0">{{ tagsAndRootForms!.join(", ") }}</span>
      </div>
      <div class="meaning-sub-panel-wrapper">
        <div :class="{'meaning-sub-panel':true,'new-vocab-panel':showAddPanel, 'existing-vocab-panel':!showAddPanel, 'pronunciation-panel':isPronunciationPanelShown}">
          <PronunciationPanel v-if="isPronunciationPanelShown" :vocab="vocab"/>
          <NewVocabPanel v-else-if="showAddPanel"
                         :vocab="vocab"
                         :isPhrase="vocab.isPhrase"
                         :isSubmittingNewMeaning="isSubmittingNewMeaning"
                         @onSuggestedMeaningClicked="addSuggestedMeaning"
                         @onNewMeaningSubmitted="addNewMeaning"
                         @onMarkAsKnownClicked="()=>onMarkAsButtonClicked(VocabLevel.KNOWN)"
                         @onMarkAsIgnoredClicked="()=>onMarkAsButtonClicked(VocabLevel.IGNORED)"/>
          <ExistingVocabPanel v-else
                              :vocab="existingVocab!"
                              :isSubmittingEditMeaningSet="isSubmittingEditMeaningSet"
                              @onAddMoreMeaningsClicked="onAddMoreMeaningsClicked"
                              @onVocabLevelButtonClicked="updateVocabLevel"
                              @onVocabNotesEditSubmitted="updateVocabNotes"
                              @onMeaningEditSubmitted="updateMeaning"
                              @onMeaningDeleteClicked="deleteMeaning"/>
        </div>
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
import {LearnerVocabSchema, MeaningSchema, VocabLevel, VocabLevelSchema, VocabSchema} from "dzelda-common";
import {useMeaningStore} from "@/stores/backend/meaningStore.js";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import {NewVocab} from "@/components/shared/Reader.vue";
import InlineSvg from "vue-inline-svg";
import VocabPanelTopBar from "@/components/shared/vocab-panel/VocabPanelTopBar.vue";
import PronunciationPanel from "@/components/shared/vocab-panel/PronunciationPanel.vue";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

export default {
  name: "VocabPanel",
  components: {PronunciationPanel, VocabPanelTopBar, NewVocabPanel, ExistingVocabPanel, InlineSvg},
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
      isPronunciationPanelShown: false,
      isAddingMoreMeanings: false,
      isSubmittingNewMeaning: false,
      isGeneratingTTS: false,
      isSubmittingEditMeaningSet: new Set<number>(),
    };
  },
  computed: {
    tagsAndRootForms() {
      if (!this.vocab)
        return;
      return [...this.vocab.tags.map(t => t.name), ...this.vocab.rootForms];
    },
    isVocabNotSaved() {
      return [VocabLevel.NEW, VocabLevel.IGNORED, VocabLevel.KNOWN].includes(this.vocab!.level!);
    },
    showAddPanel() {
      return this.isVocabNotSaved || this.isAddingMoreMeanings;
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
      this.isPronunciationPanelShown = false;
      this.isAddingMoreMeanings = false;
    }
  },
  methods: {
    onAddMoreMeaningsClicked() {
      this.isAddingMoreMeanings = true;
    },
    onMarkAsButtonClicked(level: VocabLevelSchema) {
      const vocab = this.vocab as LearnerVocabSchema;
      this.vocabStore.addVocabToUser({vocabId: vocab.id, level});
      this.$emit("onVocabUpdated", this.vocab as LearnerVocabSchema, {level});
    },
    updateVocabLevel(level: VocabLevelSchema) {
      const vocab = this.vocab as LearnerVocabSchema;
      if (level == VocabLevel.IGNORED && vocab.isPhrase) {
        this.vocabStore.removeVocabFromUser({vocabId: vocab.id});
        this.$emit("onVocabDeleted", vocab);
      } else {
        this.vocabStore.updateUserVocab({vocabId: vocab.id}, {level: level});
        if (level == VocabLevel.IGNORED)
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
        level: [VocabLevel.NEW, VocabLevel.LEARNED, VocabLevel.KNOWN, VocabLevel.IGNORED].includes(vocab.level) ? VocabLevel.LEVEL_1 : vocab.level,
        learnerMeanings: [...vocab.learnerMeanings, meaning],
      });
      this.isAddingMoreMeanings = false;
    },
    async addNewMeaning(newMeaningText: string, newMeaningLanguageCode: string) {
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
      } else if (this.vocab.level == VocabLevel.NEW)
        newVocab = await this.vocabStore.addVocabToUser({vocabId: this.vocab.id});
      else
        newVocab = this.vocab;
      const newMeaning = await this.meaningStore.createMeaning({
        text: newMeaningText,
        vocabId: newVocab.id,
        languageCode: newMeaningLanguageCode,
      });
      await this.meaningStore.addMeaningToUser({meaningId: newMeaning.id});

      if (this.onVocabRefetched) {
        newVocab = await this.vocabStore.fetchUserVocab({vocabId: newVocab.id});
        this.isSubmittingNewMeaning = false;
        this.onVocabRefetched(newVocab);
      }
      this.isAddingMoreMeanings = false;
    },
    updateMeaning(meaning: MeaningSchema, newMeaningText: string, newMeaningLang: string) {
      const vocab = this.vocab as LearnerVocabSchema;
      this.isSubmittingEditMeaningSet.add(meaning.id);
      this.meaningStore.deleteMeaningFromUser({meaningId: meaning.id});
      this.meaningStore.createMeaning({
        vocabId: vocab.id,
        languageCode: newMeaningLang,
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
    async onGenerateTTSButtonClicked() {
      if (!this.vocab)
        return;
      this.isGeneratingTTS = true;
      let vocab: LearnerVocabSchema | VocabSchema;
      if (!("id" in this.vocab)) {
        vocab = {
          ...await this.vocabStore.createVocab({
            text: this.vocab.text,
            languageCode: this.vocab.language,
            isPhrase: this.vocab.isPhrase,
          }),
          level: VocabLevel.NEW,
          notes: null,
          learnerMeanings: [],
          ttsPronunciationUrl: null,
          learnersCount: 0,
          tags: [],
          rootForms: [],
        };
        this.$emit("onNewVocabCreated", vocab);
      } else
        vocab = this.vocab;
      const preferredVoice = this.languageStore.userLanguages?.find((l) => l.code === vocab.language)?.preferredTtsVoice;
      const ttsPronunciation = await this.vocabStore.generateVocabTTS({vocabId: vocab.id, voiceCode: preferredVoice?.code});

      if (ttsPronunciation)
        this.$emit("onVocabUpdated", vocab, {ttsPronunciationUrl: ttsPronunciation!.url});
      this.isGeneratingTTS = false;
    }
  },
  setup() {
    return {
      VocabLevel,
      meaningStore: inject<ReturnType<typeof useMeaningStore>>("meaningStore", useMeaningStore()),
      vocabStore: inject<ReturnType<typeof useVocabStore>>("vocabStore", useVocabStore()),
      languageStore: inject<ReturnType<typeof useLanguageStore>>("vocabStore", useLanguageStore()),
    };
  }
};
</script>

<style scoped>

.tags {
  margin-bottom: 0.3rem;
  min-height: 1lh;
}

.root-form, .tag {
  font-size: 0.9rem;
  color: gray;
}

.meaning-sub-panel-wrapper {
  padding-right: 20px;
}

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
