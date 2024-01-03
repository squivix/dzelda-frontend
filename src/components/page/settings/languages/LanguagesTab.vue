<template>
  <div class="settings-tab">
    <h2>Languages</h2>
    <LoadingScreen v-if="!userLanguages"/>
    <EmptyScreen v-else-if="userLanguages.length==0" message="No languages learning">
      <template v-slot:no-filters>
        <router-link :to="{name:'new-language'}" class="new-language-button empty-screen inv-link">
          <inline-svg :src="icons.plusRound" class="empty-icon"/>
          <p>Not learning any languages</p>
          <p>Add language</p>
        </router-link>
      </template>
    </EmptyScreen>
    <table v-else class="languages">
      <thead>
      <tr>
        <th>Language</th>
        <th>Learning Since</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <LanguageRow v-for="language in userLanguages"
                   :key="language.id"
                   :language="language"
                   :isButtonsDisabled="isSubmitting"
                   :isSubmittingRemoveLanguage="isSubmitting&&languageToBeRemoved?.id==language.id"
                   :isSubmittingResetLanguage="isSubmitting&&languageToBeReset?.id==language.id"
                   @onRemoveLanguageClicked="onRemoveLanguageClicked"
                   @onResetLanguageClicked="onResetLanguageClicked"
      />
      </tbody>
      <tfoot>
      <tr>
        <td colspan="3">
          <router-link :to="{name:'new-language'}" class="new-language-link">
            <inline-svg :src="icons.plusRound" class="language-icon"/>
            <p>Add another language</p>
          </router-link>
        </td>
      </tr>
      </tfoot>
    </table>

    <SeriousConfirmDialog :isShown="isConfirmRemoveDialogShown"
                          :yesText="`Yes, delete all my ${languageToBeRemoved?.name} data`"
                          :expectedText="`delete language`"
                          @onYesClicked="removeLanguage"
                          @onNoClicked="isConfirmRemoveDialogShown=false">
      <p>Are you sure you want to remove {{ languageToBeRemoved?.name }} from your languages?
        <br>
        <br>
        This action cannot be undone. All your {{ languageToBeRemoved?.name }} data will be permanently deleted.</p>
    </SeriousConfirmDialog>

    <SeriousConfirmDialog :isShown="isConfirmResetDialogShown"
                          :yesText="`Yes, delete all my ${languageToBeRemoved?.name} data`"
                          :expectedText="`reset language`"
                          @onYesClicked="resetLanguage"
                          @onNoClicked="isConfirmResetDialogShown=false">
      <p>Are you sure you want to reset your {{ languageToBeRemoved?.name }} progress?
        <br>
        <br>
        This action cannot be undone. All your {{ languageToBeRemoved?.name }} data will be permanently deleted.</p>
    </SeriousConfirmDialog>
  </div>
</template>

<script lang="ts">
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {LanguageSchema, LearnerLanguageSchema} from "dzelda-common";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import SeriousConfirmDialog from "@/components/shared/SeriousConfirmDialog.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import LanguageRow from "@/components/page/settings/languages/LanguageRow.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";

export default {
  name: "LanguagesTab",
  components: {LoadingScreen, EmptyScreen, LanguageRow, SubmitButton, SeriousConfirmDialog, InlineSvg},
  data() {
    return {
      userLanguages: null as LearnerLanguageSchema[] | null,
      isSubmitting: false,
      languageToBeRemoved: null as LanguageSchema | null,
      languageToBeReset: null as LanguageSchema | null,
      isConfirmRemoveDialogShown: false,
      isConfirmResetDialogShown: false,
    };
  },
  methods: {
    onRemoveLanguageClicked(language: LanguageSchema) {
      this.isConfirmRemoveDialogShown = true;
      this.languageToBeRemoved = language;
    },
    onResetLanguageClicked(language: LanguageSchema) {
      this.isConfirmResetDialogShown = true;
      this.languageToBeReset = language;
    },
    async removeLanguage() {
      if (this.languageToBeRemoved) {
        this.isConfirmRemoveDialogShown = false;
        this.isSubmitting = true;
        await this.languageStore.deleteLanguageFromUser({
          languageCode: this.languageToBeRemoved.code,
        });
        this.isSubmitting = false;
        this.languageToBeRemoved = null;
        this.messageBarStore.addMessage({text: "Language deleted", type: MessageType.SUCCESS});
        this.userLanguages = await this.languageStore.fetchUserLanguages({ignoreCache: true});
      }
    },
    async resetLanguage() {
      if (this.languageToBeReset) {
        this.isConfirmResetDialogShown = false;
        this.isSubmitting = true;
        await this.languageStore.resetUserLanguageProgress({
          languageCode: this.languageToBeReset.code,
        });
        this.isSubmitting = false;
        this.languageToBeReset = null;
        this.messageBarStore.addMessage({text: "Language progress reset", type: MessageType.SUCCESS});
        this.userLanguages = await this.languageStore.fetchUserLanguages({ignoreCache: true});
      }
    },

  },
  async mounted() {
    this.userLanguages = await this.languageStore.fetchUserLanguages();
  },
  setup() {
    return {
      icons,
      messageBarStore: useMessageBarStore(),
      languageStore: useLanguageStore()
    };
  }
};
</script>

<style scoped>
.settings-tab {
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
}

h2 {
  font-size: 1.75rem;
}

.languages th {
  text-align: start;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0 0.25rem 0.75rem;
}

.languages tbody:deep(tr:nth-child(odd)) {
  background-color: whitesmoke;
}


.languages tfoot td {
  padding-top: 1rem;
}

.new-language-link {
  display: flex;
  flex-direction: row;
  column-gap: 0.5rem;
  align-items: center;;
}

.new-language-link {
  color: black;
}

.new-language-button:hover, .new-language-button:hover .empty-icon {
  color: #183153;
}

@media screen and (max-width: 750px) {
  h2 {
    display: none
  }
}
</style>
