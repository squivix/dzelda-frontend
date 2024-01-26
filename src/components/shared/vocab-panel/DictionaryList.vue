<template>
  <div class="dictionaries-wrapper" v-if="dictionaries.length>0">
    <h5>Dictionaries</h5>
    <ol class="dictionaries styled-scrollbars" v-for="dictionary in dictionaries" :key="dictionary.id">
      <li @click="openDictionaryLink(dictionary)">{{ dictionary.name }}</li>
    </ol>
  </div>
</template>

<script lang="ts">
import {useDictionaryStore} from "@/stores/backend/dictionaryStore.js";
import {DictionarySchema} from "dzelda-common";
import {inject} from "vue";
import {useLessonStore} from "@/stores/backend/lessonStore.js";

export default {
  name: "DictionaryList",
  components: {},
  props: {
    languageCode: {type: String, required: true},
    vocabText: {type: String, required: true},
  },
  data() {
    return {
      dictionaries: [] as DictionarySchema[],
    };
  },
  methods: {
    openDictionaryLink(dictionary: DictionarySchema) {
      const link = dictionary.link.replace("<text>", this.vocabText);
      const ref = window.open(link, "Dictionary", "left=0,top=0,width=800,height=500,toolbar=1,resizable=0");
      ref!.focus();
    }
  }
  ,
  async mounted() {
    this.dictionaries = await this.dictionaryStore.fetchDictionaries({languageCode: this.languageCode});
  },
  setup() {
    return {
      dictionaryStore: inject<ReturnType<typeof useDictionaryStore>>("dictionaryStore", useDictionaryStore()),
    };
  }
};
</script>

<style scoped>
.dictionaries-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
}

h5 {
  color: var(--panel-new-text-color);
  font-weight: bold;
}

.dictionaries {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  overflow-y: auto;
  padding-right: 0.5rem;
  max-height: 200px;
}

.dictionaries > li {
  background-color: var(--dictionary-item-color);
  color: var(--on-background-color);
  padding: 15px 10px;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 5px;
  width: 100%;
}
</style>
