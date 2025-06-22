<template>
  <div v-if="isProcessing" class="processing-div">
    <inline-svg :src="icons.hourglass" class="processing-icon"/>
    <p>Processing...</p>
  </div>
  <div class="stats" v-else>
    <div class="stats-count">
      <span class="vocabs-indicator new-vocabs"></span>
      <div>
        <span>{{ vocabsByLevel![VocabLevel.NEW] }} (</span>
        <span :class="newVocabsPercentageClass">{{ newVocabsPercentage }}%</span>
        <span>)</span>
      </div>

    </div>
    <div class="stats-count">
      <span class="vocabs-indicator saved-vocabs"></span>
      <span>{{ savedVocabsCount }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import type {PropType} from 'vue';
import InlineSvg from "vue-inline-svg";
import type {VocabsByLevelSchema} from "dzelda-common";
import {VocabLevel} from "dzelda-common";
import {icons} from "@/icons.js";
import constants from "@/constants.js";

export default defineComponent({
  name: "VocabLevelStats",
  components: {InlineSvg},
  props: {
    isProcessing: {type: Boolean, required: true},
    vocabsByLevel: {type: Object as PropType<VocabsByLevelSchema>, required: true}
  },
  computed: {
    newVocabsPercentage() {
      const total = this.vocabsByLevel![VocabLevel.NEW] + this.savedVocabsCount;
      if (total == 0) //prevent NaN% from dividing 0/0
        return 0.00;
      const percentage = (this.vocabsByLevel![VocabLevel.NEW] / total) * 100;
      return Number(percentage.toFixed(2));
    },
    newVocabsPercentageClass() {
      const p = this.newVocabsPercentage;
      if (p >= 0 && p <= constants.NEW_VOCABS_PERCENTAGE_THRESH.easy)
        return "easy";
      else if (p <= constants.NEW_VOCABS_PERCENTAGE_THRESH.medium)
        return "medium";
      else
        return "hard";
    },
    savedVocabsCount() {
      let count = 0;
      for (let level in this.vocabsByLevel!) {
        if (Number(level) !== VocabLevel.NEW && Number(level) !== VocabLevel.IGNORED) {
          count += this.vocabsByLevel![level as keyof VocabsByLevelSchema]; //ts is acting up
        }
      }
      return count;
    }
  },
  setup() {
    return {
      VocabLevel,
      icons,
    }
  }
})
</script>

<style scoped>

.vocabs-indicator {
  width: 15px;
  height: 15px;
}

.new-vocabs {
  background-color: var(--vocab-new-color);
}

.saved-vocabs {
  background-color: var(--vocab-level-1-color);
}

.stats {
  display: flex;
  column-gap: 1rem;
  align-items: center;
}

.stats-count {
  display: flex;
  flex-direction: row;
  column-gap: 0.25rem;
  align-items: center;
}

/*noinspection CssUnusedSymbol*/
.easy {
  color: green;
}

/*noinspection CssUnusedSymbol*/
.medium {
  color: #E09134;
}

/*noinspection CssUnusedSymbol*/
.hard {
  color: red;
}
</style>
