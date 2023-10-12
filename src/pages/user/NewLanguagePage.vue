<template>
  <base-card title="New Language" class="new-language-card">
    <template v-slot:content>
      <div class="content">
        <p>Select a new language to learn from our list of supported languages</p>
        <ul v-if="supportedLanguages" class="languages">
          <li v-for="language in supportedLanguages" :key="language.code" @click="addNewLanguage(language)">
            <font-awesome-icon v-if="language.isLearning" icon="check"
                               class="is-learning-check"></font-awesome-icon>
            <img :src="language.flagCircular!" :alt="`${language.code} language flag`"
                 class="language-flag">
            <div class="title-learners">
              <h4>{{ language.name }}</h4>
              <p>{{ language.learnersCount }} learners</p>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {LanguageSchema} from "dzelda-types";

export default {
  name: "NewLanguagePage",
  components: {BaseCard, FontAwesomeIcon},
  data() {
    return {
      supportedLanguages: null as (LanguageSchema & { isLearning: boolean })[] | null
    };
  },
  methods: {
    async fetchSupportedLanguages() {
      return await this.languageStore.fetchLanguages({isSupported: true});
    },
    async addNewLanguage(language: LanguageSchema & { isLearning: boolean }) {
      //TODO move to custom dialog
      if (language.isLearning)
        alert(`You are already learning ${language.name}`);
      else if (confirm(`Start learning ${language.name}?`)) {
        await this.languageStore.addLanguageToUser({languageCode: language.code});
        await this.languageStore.fetchUserLanguages({ignoreCache: true});
        await this.$router.push({name: "explore", params: {learningLanguage: language.code}});
      }
    }
  },
  async mounted() {
    const supportedLanguages = await this.fetchSupportedLanguages();
    const userLanguages = await this.languageStore.fetchUserLanguages();

    this.supportedLanguages = supportedLanguages.map((lang) => ({
      ...lang,
      isLearning: userLanguages.findIndex(l => l.code === lang.code) !== -1
    }));
  },
  setup() {
    return {languageStore: useLanguageStore()};
  }
};
</script>

<style scoped>
.new-language-card {
  width: 85vw;
  max-width: 900px;
}

.content {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.languages {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  row-gap: 1rem;
  column-gap: 1rem;
  flex-grow: 1;
}

.languages li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 1rem;
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border: 1px solid lightgray;
  border-radius: 10px;
  transition: transform 0.15s ease-out;
  overflow: hidden;
  box-sizing: border-box;
}

.languages li:hover {
  transform: scale(1.04);
  cursor: pointer;
}

.languages li .title-learners {
  line-height: 1.25rem;
  text-align: center;
}

.languages li h4 {
  font-size: 1.2rem;
}

.languages li p {
  font-size: 0.9rem;
  color: darkslategray;
}

.language-flag {
  width: 125px;
  height: 125px;
}

.learning-language {
  background-color: red;
}

.is-learning-check {
  background-color: var(--secondary-color);
  color: var(--on-secondary-color);
  width: 20px;
  height: 20px;
  padding: 0.2rem;
  border-radius: 3px;
  align-self: flex-end;
}

</style>
