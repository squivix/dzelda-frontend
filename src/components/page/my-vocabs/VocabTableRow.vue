<template>
  <tr>
    <td @click.stop="onVocabClicked" class="link-parent">
      <button class="inv-button link">
        {{ vocab.text }}
      </button>
    </td>
    <td>
      <ul>
        <li v-for="meaning in vocab.learnerMeanings"
            :key="meaning.id">
          {{ meaning.text }}
        </li>
      </ul>
    </td>
    <td class="level-picker-td">
      <!--                                <vocab-level-display :level="vocab.level"></vocab-level-display>-->
      <VocabLevelPicker :level="vocab.level"
                        :vocab-id="vocab.id"
                        @onVocabLevelSet="(level)=>onVocabLevelSet(vocab, level)"/>
    </td>
  </tr>
</template>

<script lang="ts">
import VocabLevelPicker from "@/components/shared/vocab-panel/VocabLevelPicker.vue";
import {VocabLevelSchema} from "dzelda-types";

export default {
  name: "VocabTableRow",
  emits: ["onVocabClicked", "onVocabLevelSet"],
  components: {VocabLevelPicker},
  props: {
    vocab: {
      type: Object,
      required: true,
    }
  },
  methods: {
    onVocabClicked() {
      this.$emit("onVocabClicked");
    },
    onVocabLevelSet(level: VocabLevelSchema) {
      this.$emit("onVocabLevelSet", level);
    }
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

tr:nth-child(odd) {
  background-color: whitesmoke;
}

td {
  padding: 1rem 1rem;
}

td button {
  font-size: 1rem;
  text-align: start;
}

.level-picker-td {
  width: 20%;
}
</style>
