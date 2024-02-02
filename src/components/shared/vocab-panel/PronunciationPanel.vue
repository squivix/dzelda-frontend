<template>
  <div class="pronunciation-panel">
    <audio ref="audioElement" :src="pronunciationPlaying?.url"></audio>
    <div>
      <h5>Text to speech Pronunciations</h5>
      <p v-if="vocab.ttsPronunciations.length==0">No text to speech Pronunciations</p>
      <ul class="pronunciation-list styled-scrollbars" v-else>
        <li v-for="ttsPronunciation in vocab.ttsPronunciations" :key="ttsPronunciation.id" class="pronunciation" @click="setPronunciationPlaying(ttsPronunciation)">
          <inline-svg :src="pronunciationPlaying===ttsPronunciation?icons.stopPlayback:icons.audio"/>
          <p>{{ ttsPronunciation.voice!.accent }}</p>
        </li>
      </ul>
    </div>
    <div>
      <h5>Human Pronunciations</h5>
      <LoadingScreen v-if="!humanPronunciations" style="height: auto" />
      <p v-else-if="humanPronunciations.length==0">No human Pronunciations</p>
      <ul class="pronunciation-list styled-scrollbars" v-else>
        <li v-for="humanPronunciation in humanPronunciations" :key="humanPronunciation.id" class="pronunciation" @click="setPronunciationPlaying(humanPronunciation)">
          <inline-svg :src="pronunciationPlaying===humanPronunciation?icons.stopPlayback:icons.audio"/>
          <p>{{ humanPronunciation.text }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, nextTick, PropType} from "vue";
import {HumanPronunciationSchema, LearnerVocabSchema, TTSPronunciationSchema} from "dzelda-common";
import {NewVocab} from "@/components/shared/LessonReader.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";

export default defineComponent({
  name: "PronunciationPanel",
  components: {LoadingScreen, InlineSvg},
  props: {
    vocab: {type: Object as PropType<LearnerVocabSchema | NewVocab>, default: null},
  },
  data() {
    return {
      humanPronunciations: null as HumanPronunciationSchema[] | null,
      pronunciationPlaying: null as TTSPronunciationSchema | HumanPronunciationSchema | null
    };
  },
  watch: {
    async vocab() {
      this.humanPronunciations = (await this.vocabStore.fetchHumanPronunciations({languageCode: this.vocab.language, text: this.vocab.text})).data;
    }
  },
  async mounted() {
    this.humanPronunciations = (await this.vocabStore.fetchHumanPronunciations({languageCode: this.vocab.language, text: this.vocab.text})).data;
  },
  methods: {
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
    return {
      icons,
      vocabStore: useVocabStore()
    };
  }
});
</script>

<style scoped>
.pronunciation-panel {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
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
  max-height: 220px;
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
  column-gap: 0.5rem;
}
</style>
