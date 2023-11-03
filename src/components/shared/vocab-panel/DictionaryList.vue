<template>
  <div class="dictionaries-wrapper">
    <h5 v-if="dictionaries.length>0">Dictionaries</h5>
    <ol class="dictionaries styled-scrollbars" v-for="dictionary in dictionaries" :key="dictionary.id">
      <li @click="openDictionaryLink(dictionary)">{{ dictionary.name }}</li>
    </ol>
  </div>
</template>

<script lang="ts">
import {useDictionaryStore} from "@/stores/backend/dictionaryStore.js";

export default {
  name: "DictionaryList",
  components: {},
  props: {
    vocabText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dictionaries: [],
    };
  },
  methods: {
    openDictionaryLink(dictionary) {
      const link_template = dictionary.link;
      const link = link_template.replace("<text>", this.vocabText)
      //TODO save paramaters of opened window locally
      const ref = window.open(link, "Dictionary", "left=20,top=20,width=800,height=500,toolbar=1,resizable=0");
      ref.focus();
    }
  }
  ,
  async mounted() {
    this.dictionaries = await this.dictionaryStore.fetchDictionaries({languageCode: this.$route.params.learningLanguage});
  },
  created() {
    this.dictionaryStore = useDictionaryStore();
  }
}
</script>

<style scoped>
.dictionaries-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.dictionaries {
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  overflow-y: auto;
  padding-right: 0.5rem;
  max-height: 25vh;
}

.dictionaries > li {
  background-color: #FFE675;
  padding: 15px 10px;
  cursor: pointer;
  font-size: 1rem;
  color: black;
  border-radius: 5px;
  width: 100%;
}
</style>