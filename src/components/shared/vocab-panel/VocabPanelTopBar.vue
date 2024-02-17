<template>
  <div class="top-bar">
    <div class="left-side">
      <template v-if="!isPronunciationPanelShown">
        <button v-if="preferredTTS " class="audio-button" @click="onPlayTTSButtonClicked">
          <inline-svg :src="isPlaying?icons.stopPlayback:icons.audio"/>
          <audio ref="ttsAudioElement" @play="isPlaying=true" @ended="isPlaying=false" :src="preferredTTS.url" autoplay></audio>
        </button>
        <SubmitButton v-else class="audio-button" :iconSrc="icons.tts" @click="$emit('onGenerateTTSButtonClicked')" :isSubmitting="isGeneratingTTS"/>
      </template>
      <h4 class="vocab-text">{{ vocab.text }}</h4>
    </div>
    <button class="pronunciations-button" @click="$emit('onPronunciationButtonClicked')">
      <span>
        <inline-svg :src="icons.pronunciation"/>
      </span>
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import InlineSvg from "vue-inline-svg";
import {LearnerVocabSchema} from "dzelda-common";
import {NewVocab} from "@/components/shared/Reader.vue";
import {icons} from "@/icons.js";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import SubmitButton from "@/components/ui/SubmitButton.vue";

export default defineComponent({
  name: "VocabPanelTopBar",
  components: {SubmitButton, InlineSvg},
  emits: ["onPronunciationButtonClicked", "onGenerateTTSButtonClicked"],
  props: {
    vocab: {type: Object as PropType<LearnerVocabSchema | NewVocab>, default: null},
    isPronunciationPanelShown: {type: Boolean, default: false},
    isGeneratingTTS: {type: Boolean, default: false},
  },
  data() {
    return {
      isPlaying: true,
    };
  },
  computed: {
    preferredVoice() {
      const language = this.languageStore.userLanguages?.find(l => l.code === this.vocab.language)!;
      return language?.preferredTtsVoice;
    },
    preferredTTS() {
      return this.vocab.ttsPronunciations.find(pronunciation => {
        if (this.preferredVoice?.id === pronunciation.voice!.id || !this.preferredVoice && pronunciation.voice!.isDefault)
          return pronunciation;
      });
    }
  },
  methods: {
    onPlayTTSButtonClicked() {
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
    },

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
  margin-bottom: 0.25rem;
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

.audio-button:deep(svg) {
  width: 20px;
  height: 20px;
}


.pronunciations-button {
  padding: 0;
  border: none;
  background: none;
  color: var(--secondary-color);
}

.pronunciations-button > span {
  display: grid;
  place-items: center;
  border-radius: 50%;
  padding: 12px;
}

.pronunciations-button:hover > span {
  background-color: var(--secondary-faint-color);
  filter: saturate(1.5);
}

.pronunciations-button svg {
  width: 30px;
  height: 30px;
}

.vocab-text {
  font-size: 1.5rem;
  user-select: text;
}

</style>
