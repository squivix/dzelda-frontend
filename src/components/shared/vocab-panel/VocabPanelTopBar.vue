<template>
  <div class="top-bar">
    <div class="left-side">
      <button v-if="preferredTTS &&!hidePreferredTTS" class="audio-button" @click="onTTSButton">
        <inline-svg :src="isPlaying?icons.stopPlayback:icons.audio"/>
        <audio ref="ttsAudioElement" @play="isPlaying=true" @ended="isPlaying=false" :src="preferredTTS.url" autoplay></audio>
      </button>
      <h4 class="vocab-text">{{ vocab.text }}</h4>
    </div>
    <button class="pronunciations-button" @click="$emit('onPronunciationButtonClicked')">
      <inline-svg :src="icons.pronunciation"/>
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import InlineSvg from "vue-inline-svg";
import {LearnerVocabSchema} from "dzelda-common";
import {NewVocab} from "@/components/shared/LessonReader.vue";
import {icons} from "@/icons.js";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

export default defineComponent({
  name: "VocabPanelTopBar",
  components: {InlineSvg},
  emits: ["onPronunciationButtonClicked"],
  props: {
    vocab: {type: Object as PropType<LearnerVocabSchema | NewVocab>, default: null},
    hidePreferredTTS: {type: Boolean, default: false}
  },
  data() {
    return {
      isPlaying: true,
    };
  },
  computed: {
    preferredTTS() {
      const language = this.languageStore.userLanguages!.find(l => l.code === this.vocab.language)!;
      return this.vocab.ttsPronunciations.find(pronunciation => {
        if (language.preferredTtsVoice?.id === pronunciation.voice!.id || !language.preferredTtsVoice && pronunciation.voice!.isDefault)
          return pronunciation;
      });
    }
  },
  methods: {
    onTTSButton() {
      const audioElement = (this.$refs["ttsAudioElement"] as HTMLAudioElement);
      if (this.isPlaying) {
        audioElement.pause();
        audioElement.currentTime = 0;
        this.isPlaying = false;
      } else {
        audioElement.currentTime = 0;
        audioElement.play();
        this.isPlaying = true;
      }
    }
  },
  setup() {
    return {
      languageStore: useLanguageStore(),
      icons,
    };
  }
});
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.left-side {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
}


.audio-button {
  border-radius: 50%;
  aspect-ratio: 1/1;
  display: grid;
  place-items: center;
  padding: 10px;
  border: none;
  background-color: var(--secondary-color);
  color: var(--on-secondary-color)
}

.audio-button svg {
  width: 20px;
  height: 20px;
}

.pronunciations-button {
  display: grid;
  place-items: center;
  border: none;
  border-radius: 8px;
  padding: 4px;
  background: none;
  color: var(--secondary-color)
}

.pronunciations-button svg {
  width: 25px;
  height: 25px;
}

.vocab-text {
  font-size: 1.5rem;
  user-select: text;
}

</style>
