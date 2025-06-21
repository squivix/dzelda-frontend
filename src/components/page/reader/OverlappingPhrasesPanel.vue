<template>
  <div class="overlapping-phrase-panel">
    <h4>Overlapping phrases</h4>
    <ul class="phrase-list"  :dir="readingDirection">
      <li v-for="(phraseTokens, index) in overLappingPhrasesTokens" :key="index" :dir="readingDirection">
        <OverlappingPhrase :phrase="phrases[phraseTokens[0].phrases[0].text]"
                           :phraseTokens="phraseTokens"
                           @onPhraseClick="onPhraseClick"/>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {inject, PropType} from "vue";
import {LearnerVocabSchema} from "dzelda-common";
import OverlappingPhrase from "@/components/page/reader/OverlappingPhrase.vue";
import {TextTokenObject} from "@/components/shared/Reader.vue";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

export default {
  name: "OverlappingPhrasesPanel",
  computed: {
    readingDirection() {
      return this.languageStore.currentLanguage!.isRtl ? "rtl" : "ltr";
    }
  },
  components: {OverlappingPhrase},
  emits: ["onPhraseClick"],
  props: {
    overLappingPhrasesTokens: {type: Array as PropType<TextTokenObject[][]>, required: true},
    phrases: {type: Object as PropType<Record<string, LearnerVocabSchema>>, required: true},
  },
  methods: {
    onPhraseClick(phraseTokens: TextTokenObject[]) {
      this.$emit("onPhraseClick", phraseTokens);
    }
  },
  setup() {
    return {
      languageStore: inject<ReturnType<typeof useLanguageStore>>("languageStore", useLanguageStore()),
    }
  }
};
</script>

<style scoped>
.overlapping-phrase-panel {
  background-color: var(--primary-faint-color);
  height: 100%;
  padding: 1vw;
  border-radius: 10px;
}

h4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

ul {
  display: flex;
  flex-direction: column;
  max-height: 1000px;
  list-style: inside;
}

li {
  font-size: 1rem;
  line-height: 2.75rem;
}


</style>
