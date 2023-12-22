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
                   @onRemoveLanguageClicked="onRemoveLanguageClicked"/>
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

    <SeriousConfirmDialog :is-shown="isConfirmDeleteDialogShown"
                          :yes-text="`Yes, delete all my ${languageToBeRemoved?.name} data`"
                          :expected-text="`delete language`"
                          @on-yes-clicked="removeLanguage"
                          @on-no-clicked="isConfirmDeleteDialogShown=false">
      <p>Are you sure you want to remove {{ languageToBeRemoved?.name }} from your languages?
        <br>
        <br>
        This action cannot be undone. All your {{ languageToBeRemoved?.name }} data will be permanently deleted.</p>
    </SeriousConfirmDialog>
  </div>
</template>

<script lang="ts">
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {LanguageSchema, LearnerLanguageSchema} from "dzelda-types";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import SeriousConfirmDialog from "@/components/shared/SeriousConfirmDialog.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import LanguageRow from "@/components/page/settings/languages/LanguageRow.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";

export default {
  name: "LanguagesTab",
  components: {LoadingScreen, EmptyScreen, LanguageRow, SubmitButton, SeriousConfirmDialog, InlineSvg},
  data() {
    return {
      allLanguages: null as LanguageSchema[] | null,
      userLanguages: null as LearnerLanguageSchema[] | null,
      isConfirmDeleteDialogShown: false,
      languageToBeRemoved: null as LanguageSchema | null,
      isSubmittingRemoveLanguage: false
    };
  },

  computed: {
    otherLanguages() {
      if (!this.allLanguages || !this.userLanguages)
        return null;
      else
        return this.allLanguages.filter(lang => !this.userLanguages.find(userLang => userLang.code === lang.code));
    }
  },
  methods: {
    async fetchAllLanguages() {
      return await this.languageStore.fetchLanguages({isSupported: true});
    },
    async fetchUserLanguages() {
      return await this.languageStore.fetchUserLanguages();
    },
    onRemoveLanguageClicked(language: LanguageSchema) {
      this.languageToBeRemoved = language;
      this.isConfirmDeleteDialogShown = true;
    },
    async removeLanguage() {
      if (this.languageToBeRemoved) {
        this.isConfirmDeleteDialogShown = false;
        await this.languageStore.deleteLanguageFromUser({
          languageCode: this.languageToBeRemoved.code,
        });
        this.userLanguages = await this.fetchUserLanguages();
      }
    },
  },
  async mounted() {
    this.allLanguages = await this.fetchAllLanguages();
    this.userLanguages = await this.fetchUserLanguages();
  },
  setup() {
    return {
      icons,
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
  font-size: 1.5rem;
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

.new-language-button:hover, .new-language-button:hover .empty-icon{
  color: #183153;
}
@media screen and (max-width: 750px) {
  h2 {
    display: none
  }
}
</style>
