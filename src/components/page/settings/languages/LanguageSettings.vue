<template>
  <div v-if="language" class="language-settings">
    <header>
      <router-link :to="{name:'languages-settings'}" class="inv-link"><h2>Languages</h2>
      </router-link>
      <inline-svg :src="icons.arrowRight"/>
      <div class="icon-text-wrapper">
        <img class="language-flag" :src="language.flagCircular!" :alt="`${language.name} flag`">
        <h3 class="unselectable">{{ language.name }}</h3>
      </div>
    </header>
    <p>Learning Since {{ startedLearningOn }}</p>
    <div class="language-sections">
      <section>
        <h3>Dictionaries</h3>
        <UpdateDictionariesForm :languageCode="language.code" :showCancelButton="false"
                                :showSaveButtonOnlyIfEdited="true"
                                @onSubmitted="messageBarStore.addSideMessage({text:'Dictionaries saved', type:MessageType.SUCCESS, timeoutMs:3000})"/>
      </section>

      <TranslationLanguagesSection :language="language"/>

      <section class="danger-zone">
        <h3>Danger Zone</h3>
        <div class="buttons-div">
          <SubmitButton class="danger-button capsule-button mid-button"
                        @click="onRemoveLanguageClicked"
                        :enabled="!isSubmitting"
                        :isSubmitting="isSubmittingRemoveLanguage">
            Delete Language
          </SubmitButton>
          <SubmitButton class="danger-button capsule-button mid-button"
                        @click="onResetLanguageClicked"
                        :enabled="!isSubmitting"
                        :isSubmitting="isSubmittingResetLanguage">
            Reset Progress
          </SubmitButton>
        </div>
      </section>
    </div>

    <SeriousConfirmDialog :isShown="isConfirmRemoveDialogShown"
                          :yesText="`Yes, delete all my ${language.name} data`"
                          :expectedText="`delete language`"
                          @onYesClicked="removeLanguage"
                          @onNoClicked="isConfirmRemoveDialogShown=false">
      <p>Are you sure you want to remove {{ language?.name }} from your languages?
        <br>
        <br>
        This action cannot be undone. All your {{ language?.name }} data will be permanently
        deleted.</p>
    </SeriousConfirmDialog>

    <SeriousConfirmDialog :isShown="isConfirmResetDialogShown"
                          :yesText="`Yes, reset all my ${language?.name} progress data`"
                          :expectedText="`reset language`"
                          @onYesClicked="resetLanguage"
                          @onNoClicked="isConfirmResetDialogShown=false">
      <p>Are you sure you want to reset your {{ language?.name }} progress?
        <br>
        <br>
        This action cannot be undone. All your {{ language?.name }} data will be permanently
        deleted.</p>
    </SeriousConfirmDialog>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {PropType} from "vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import type {LearnerLanguageSchema} from "dzelda-common";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";
import UpdateDictionariesForm from "@/components/shared/UpdateDictionariesForm.vue";
import SeriousConfirmDialog from "@/components/shared/SeriousConfirmDialog.vue";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";
import TranslationLanguagesSection  from "@/components/page/settings/languages/TranslationLanguagesSection.vue";

export default defineComponent({
  name: "LanguageSettings",
  components: {
    TranslationLanguagesSection,
    SeriousConfirmDialog,
    UpdateDictionariesForm,
    SubmitButton,
    InlineSvg
  },
  emits: ["onRemoveLanguageClicked", "onResetLanguageClicked"],
  props: {
    pathParams: {type: Object as PropType<{ settingsLanguage: string }>, required: true},
  },
  data() {
    return {
      language: undefined as LearnerLanguageSchema | undefined,
      isSubmittingRemoveLanguage: false,
      isSubmittingResetLanguage: false,
      isConfirmRemoveDialogShown: false,
      isConfirmResetDialogShown: false,
    };
  },
  computed: {
    startedLearningOn() {
      return new Date(this.language!.startedLearningOn).toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "numeric"
      });
    },
    isSubmitting() {
      return this.isSubmittingRemoveLanguage || this.isSubmittingResetLanguage;
    }
  },
  async mounted() {
    const userLanguages = await this.languageStore.fetchUserLanguages();
    this.language = userLanguages.find((l) => l.code == this.pathParams.settingsLanguage);
    if (!this.language)
      this.$router.push({name: "not-found"});
  },
  methods: {
    onRemoveLanguageClicked() {
      this.isConfirmRemoveDialogShown = true;
    },
    onResetLanguageClicked() {
      this.isConfirmResetDialogShown = true;
    },

    async removeLanguage() {
      if (!this.language)
        return;
      this.isConfirmRemoveDialogShown = false;
      this.isSubmitting = true;
      await this.languageStore.deleteLanguageFromUser({
        languageCode: this.language.code,
      });
      await this.languageStore.fetchUserLanguages({ignoreCache: true});
      this.isSubmitting = false;
      this.messageBarStore.addTopBarMessage({text: "Language deleted", type: MessageType.SUCCESS});
      this.$router.push({name: "languages-settings"});
    },
    async resetLanguage() {
      if (!this.language)
        return;
      this.isConfirmResetDialogShown = false;
      this.isSubmitting = true;
      await this.languageStore.resetUserLanguageProgress({
        languageCode: this.language.code,
      });
      await this.languageStore.fetchUserLanguages({ignoreCache: true});
      this.messageBarStore.addTopBarMessage({
        text: "Language progress reset",
        type: MessageType.SUCCESS
      });
      this.isSubmitting = false;
    },
  },
  setup() {
    return {
      languageStore: useLanguageStore(),
      messageBarStore: useMessageBarStore(),
      icons,
      MessageType
    };
  }
});
</script>

<style scoped>
.language-settings {
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
}


header {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  flex-wrap: wrap;
  row-gap: 0.5rem;
}

.language-sections {
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
}

h2 {
  font-size: 1.75rem;
}

h3 {
  font-size: 1.5rem;
}

.language-flag {
  width: 25px;
  height: 25px;
}


section {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.danger-zone button {
  align-self: flex-start;
}

.buttons-div {
  display: flex;
  column-gap: 1rem;
  flex-wrap: wrap;
  row-gap: 1rem;
}
</style>
