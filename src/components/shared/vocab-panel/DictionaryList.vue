<template>
  <div class="dictionaries-wrapper">
    <div class="header">
      <h5>Dictionaries</h5>
      <button v-if="allowEditDictionaries" class="edit-button inv-button" @click="isEditDictionaryListDialogShown=true">
        <inline-svg :src="userDictionaries.length==0?icons.plus:icons.pen"/>
      </button>
    </div>
    <p class="empty-message" v-if="userDictionaries.length==0">No dictionaries saved</p>
    <ol class="dictionaries styled-scrollbars">
      <li @click="openDictionaryLink(dictionary)" v-for="dictionary in userDictionaries" :key="dictionary.id">{{ dictionary.name }}</li>
    </ol>
    <UpdateDictionariesDialog v-if="allowEditDictionaries" :isShown="isEditDictionaryListDialogShown" @onClosed="isEditDictionaryListDialogShown=false" @onSubmitted="onDictionariesUpdated"
                              :languageCode="languageCode"/>
  </div>
</template>

<script lang="ts">
import {useDictionaryStore} from "@/stores/backend/dictionaryStore.js";
import type {DictionarySchema} from "dzelda-common";
import {inject} from "vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import UpdateDictionariesDialog from "@/components/shared/vocab-panel/UpdateDictionariesDialog.vue";

export default {
  name: "DictionaryList",
  components: {InlineSvg, UpdateDictionariesDialog},
  props: {
    languageCode: {type: String, required: true},
    vocabText: {type: String, required: true},
  },
  data() {
    return {
      userDictionaries: [] as DictionarySchema[],
      isEditDictionaryListDialogShown: false
    };
  },
  methods: {
    openDictionaryLink(dictionary: DictionarySchema) {
      const link = dictionary.lookupLink.replace("<text>", this.vocabText);
      const ref = window.open(link, "Dictionary", "left=0,top=0,width=800,height=500,toolbar=1,resizable=0");
      ref!.focus();
    },
    async onDictionariesUpdated() {
      this.userDictionaries = await this.dictionaryStore.fetchUserDictionaries({languageCode: this.languageCode}, true);
      this.isEditDictionaryListDialogShown = false;
    }
  }
  ,
  async mounted() {
    this.userDictionaries = await this.dictionaryStore.fetchUserDictionaries({languageCode: this.languageCode});
  },
  setup() {

    return {
      icons,
      allowEditDictionaries: inject<boolean>("allowEditDictionaries", true),
      dictionaryStore: inject<ReturnType<typeof useDictionaryStore>>("dictionaryStore", useDictionaryStore()),
    };
  }
};
</script>

<style scoped>
.dictionaries-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 0.25rem;
  padding-right: 0.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.edit-button {
  padding: 0.5rem;
  color: var(--panel-new-text-color);
}

h5 {
  color: var(--panel-new-text-color);
  font-weight: bold;
}

.dictionaries {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;

  padding-right: 5px;
  overflow-y: auto;
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

.empty-message {
  margin-bottom: 1rem;
}
</style>
