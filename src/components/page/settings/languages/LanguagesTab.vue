<template>
  <div class="settings-tab">
    <h2>Languages</h2>
    <table class="languages">
      <thead>
      <tr>
        <th>Language</th>
        <th>Learning Since</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="language in userLanguages" :key="language.id">
        <td>{{ language.name }}</td>
        <td>{{ language.addedOn }}</td>
        <td>
          <button class="inv-button link" @click="removeLanguage(language)">Remove</button>
          <button class="inv-button link" @click="resetLanguageProgress">Reset Progress</button>
        </td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td colspan="3">
          <router-link :to="{name:'new-language'}" class="new-language link">
            <inline-svg :src="icons.plusRound" class="language-icon"/>
            <button class="inv-button link">
              Add another language
            </button>
          </router-link>
        </td>
      </tr>
      </tfoot>
    </table>
  </div>
</template>

<script lang="ts">
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {LanguageSchema, LearnerLanguageSchema} from "dzelda-types";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";

export default {
  name: "LanguagesTab",
  components: {InlineSvg},
  data() {
    return {
      allLanguages: null as LanguageSchema[] | null,
      userLanguages: null as LearnerLanguageSchema[] | null,
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
      return await this.languageStore.fetchLanguages({supported: true});
    },
    async fetchUserLanguages() {
      return await this.languageStore.fetchUserLanguages();
    },
    async removeLanguage(language: LanguageSchema) {
      //TODO move to modal dialogue
      if (confirm("Are you sure you want to delete this language?")) {
        await this.languageStore.deleteLanguageFromUser({
          languageCode: language.code,
        });
        this.userLanguages = await this.fetchUserLanguages();
      }
    }, resetLanguageProgress() {

    }
  },
  async mounted() {
    this.allLanguages = await this.fetchAllLanguages();
    this.userLanguages = await this.fetchUserLanguages()
  },
  setup() {
    return {
      icons,
      languageStore: useLanguageStore()
    };
  }
}
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
  padding-bottom: 0.75rem;
}

.languages tbody tr:nth-child(odd) {
  background-color: whitesmoke;
}


.languages td {
  padding: 0.5rem 0;
}

.languages tfoot td {
  padding-top: 1rem;
}

.new-language {
  display: flex;
  flex-direction: row;
  column-gap: 0.5rem;
  align-items: center;
}

.new-language svg {
  color: black;
}

</style>
