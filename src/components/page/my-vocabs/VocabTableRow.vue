<template>
  <tr @click.stop="onVocabClicked" :class="{'selected-vocab':isSelected}">
    <td class="vocab-text">
      {{ vocab.text }}
    </td>
    <td class="vocab-meanings">
      <ul>
        <li v-for="meaning in vocab.learnerMeanings"
            :key="meaning.id">
          <span class="bullet-point">&bull;</span> {{ meaning.text }}
        </li>
      </ul>
    </td>
  </tr>
</template>

<script lang="ts">
import VocabLevelPicker from "@/components/shared/vocab-panel/VocabLevelPicker.vue";
import type {LearnerVocabSchema} from "dzelda-common";
import type {PropType} from "vue";

export default {
  name: "VocabTableRow",
  emits: ["onVocabClicked"],
  components: {VocabLevelPicker},
  props: {
    vocab: {type: Object as PropType<LearnerVocabSchema>, required: true},
    isSelected: {type: Boolean, default: false}
  },
  methods: {
    onVocabClicked() {
      this.$emit("onVocabClicked");
    },
  },
  mounted() {
  }
};
</script>

<style scoped>

tr {
  padding-right: 1rem;
  padding-left: 1rem;
}

tr:hover {
  cursor: pointer;
}

tr.selected-vocab {
  background-color: var(--selected-new-vocab-color) !important;
  color: white;
}

tr:hover > .vocab-text {
  text-decoration: underline;
}

tr:nth-child(odd) {
  background-color: var(--zebra-stripe-color);
}

.vocab-text {
  font-size: 1.25rem;
}

td {
  padding: 0.75rem 0.25rem;
}

.level-picker-td {
  width: 20%;
}

.bullet-point {
  font-weight: bold;
  font-size: 1.7rem;
}

li {
  display: flex;
  align-items: center;
  column-gap: 0.4rem;
}

@media screen and (max-width: 750px) {
  .level-picker-td {
    display: none;
  }
}
</style>
