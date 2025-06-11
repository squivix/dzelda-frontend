<template>
  <div class="pronunciation-panel">
    <audio ref="audioElement" :src="pronunciationPlaying?.url" @ended="pronunciationPlaying=null" @error="pronunciationPlaying=null"></audio>
    <div>
      <h5>Text to speech Pronunciations</h5>
      <LoadingScreen v-if="!ttsPronunciations" class="loading-screen"/>
      <p v-else-if="ttsPronunciations.length==0">No text to speech Pronunciations</p>
      <ul v-else class="pronunciation-list styled-scrollbars">
        <li v-for="ttsPronunciation in ttsPronunciations" :key="ttsPronunciation.id" class="pronunciation" @click="setPronunciationPlaying(ttsPronunciation)">
          <div class="pronunciation-side">
            <inline-svg :src="pronunciationPlaying===ttsPronunciation?icons.stopPlayback:icons.audio"/>
            <p>{{ `${vocab.text}${ttsPronunciation?.voice?.accentCountryCode ? ` (${ttsPronunciation.voice.accentCountryCode})` : ""}` }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div>
      <h5>Human Pronunciations</h5>
      <LoadingScreen v-if="!humanPronunciations" class="loading-screen"/>
      <p v-else-if="humanPronunciations.length==0">No human Pronunciations</p>
      <ul v-else class="pronunciation-list styled-scrollbars" ref="hpsListsRef">
        <li v-for="humanPronunciation in humanPronunciations" :key="humanPronunciation.id" class="pronunciation" @click="setPronunciationPlaying(humanPronunciation)">
          <div class="pronunciation-side">
            <inline-svg :src="pronunciationPlaying===humanPronunciation?icons.stopPlayback:icons.audio"/>
            <p>{{ humanPronunciation.text }}</p>
          </div>
          <AttributionIcon :attribution="humanPronunciation.attribution" :attributionSourceId="humanPronunciation.attributionSource?.id" :scrollOffsetPx="-hpsListScrollPosition"/>
        </li>
      </ul>
    </div>
    <div>
      <h5>Pronunciation Dictionaries</h5>
      <LoadingScreen v-if="!pronunciationDictionaries" class="loading-screen"/>
      <p v-else-if="pronunciationDictionaries.length==0">No Pronunciation Dictionaries</p>
      <!--      TODO move to common component-->
      <ul class="dictionaries styled-scrollbars" v-else>
        <li @click="openDictionaryLink(dictionary)" v-for="dictionary in pronunciationDictionaries" :key="dictionary.id">{{ dictionary.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, inject, nextTick, PropType, ref} from "vue";
import {DictionarySchema, HumanPronunciationSchema, LearnerVocabSchema, TTSPronunciationSchema} from "dzelda-common";
import {NewVocab} from "@/components/shared/Reader.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import {useDictionaryStore} from "@/stores/backend/dictionaryStore.js";
import AttributionIcon from "@/components/ui/AttributionIcon.vue";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {useScroll} from "@vueuse/core";

export default defineComponent({
  name: "PronunciationPanel",
  components: {AttributionIcon, LoadingScreen, InlineSvg},
  props: {
    vocab: {type: Object as PropType<LearnerVocabSchema | NewVocab>, default: null},
  },
  data() {
    return {
      ttsPronunciations: null as TTSPronunciationSchema[] | null,
      humanPronunciations: null as HumanPronunciationSchema[] | null,
      pronunciationDictionaries: null as DictionarySchema[] | null,
      pronunciationPlaying: null as TTSPronunciationSchema | HumanPronunciationSchema | null,
    };
  },
  watch: {
    async vocab() {
      this.humanPronunciations = (await this.vocabStore.fetchHumanPronunciations({languageCode: this.vocab.language, text: this.vocab.text})).data;
    }
  },
  mounted() {
    if ("id" in this.vocab)
      this.vocabStore.fetchVocabTTSPronunciations({vocabId: this.vocab.id})
          .then(response => this.ttsPronunciations = response.data);
    this.dictionaryStore.fetchDictionaries({languageCode: this.vocab.language, isPronunciation: true})
        .then(dictionaries => this.pronunciationDictionaries = dictionaries);
    this.vocabStore.fetchHumanPronunciations({languageCode: this.vocab.language, text: this.vocab.text})
        .then(response => this.humanPronunciations = response.data);
  },
  methods: {
    openDictionaryLink(dictionary: DictionarySchema) {
      const link = dictionary.lookupLink.replace("<text>", this.vocab.text);
      const ref = window.open(link, "Dictionary", "left=0,top=0,width=800,height=500,toolbar=1,resizable=0");
      ref!.focus();
    },
    setPronunciationPlaying(pronunciationPlaying: TTSPronunciationSchema | HumanPronunciationSchema) {
      const audioElement = this.$refs["audioElement"] as HTMLAudioElement;
      if (this.pronunciationPlaying === pronunciationPlaying) {
        this.pronunciationPlaying = null;
      } else {
        this.pronunciationPlaying = pronunciationPlaying;
        audioElement.load();
        nextTick(() => audioElement.play());
      }
    }
  },
  setup() {
    const hpsListsRef = ref(null);
    const {y: hpsListScrollPosition} = useScroll(hpsListsRef);
    return {
      icons,
      hpsListsRef,
      hpsListScrollPosition,
      vocabStore: inject<ReturnType<typeof useVocabStore>>("vocabStore", useVocabStore()),
      dictionaryStore: inject<ReturnType<typeof useDictionaryStore>>("dictionaryStore", useDictionaryStore()),
    };
  }
});
</script>

<style scoped>
.pronunciation-panel {
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
}

h5 {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.pronunciation-list {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  padding-right: 5px;
  overflow-y: auto;
  max-height: 170px;
}

.pronunciation {
  background-color: var(--secondary-color);
  color: var(--on-secondary-color);
  padding: 15px 10px;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 5px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pronunciation-side {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
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

.loading-screen {
  height: auto;
  padding: 1rem 0;
}

.loading-screen:deep(.spinner) {
  width: 35px;
  height: 35px;
}

</style>
