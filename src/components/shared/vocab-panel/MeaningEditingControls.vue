<template>
  <h5>Saved Meanings</h5>
  <ol class="user-meanings">
    <li v-for="(meaning,meaningIndex) in savedMeanings" :key="meaning.id">
      <form @submit.prevent="editMeaning(meaning,editedMeanings[meaningIndex])">
        <button class="delete-user-meaning-button" @click="deleteMeaning(meaning)" type="button">
          <inline-svg :src="icons.cross"/>
        </button>
        <input v-model="editedMeanings[meaningIndex]"/>
        <button class="edit-user-meaning-button"
                type="submit">
          <inline-svg :src="icons.checkMark"/>
        </button>
      </form>
    </li>
  </ol>
</template>

<script lang="ts">
import {useMeaningStore} from "@/stores/backend/meaningStore.js";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {PropType} from "vue";
import {MeaningSchema} from "dzelda-common";

export default {
  name: "MeaningEditingControls",
  components: {InlineSvg},
  emits: ["onMeaningDeleted", "onMeaningEdited"],
  props: {
    vocabId: {type: Number, required: true},
    savedMeanings: {type: Array as PropType<MeaningSchema[]>, required: true}
  },
  data() {
    return {
      editedMeanings: [] as string[],
    };
  },
  watch: {
    savedMeanings() {
      this.editedMeanings = this.savedMeanings.map(m => m.text);
    }
  },
  methods: {
    async deleteMeaning(meaning: MeaningSchema) {
      await this.meaningStore.deleteMeaningFromUser({
        meaningId: meaning.id
      });
      this.$emit("onMeaningDeleted", meaning);
    },
    async editMeaning(meaning: MeaningSchema, editedMeaning: string) {
      if (!editedMeaning)
        await this.deleteMeaning(meaning);
      else if (editedMeaning === meaning.text)
        return;

      await this.meaningStore.deleteMeaningFromUser({meaningId: meaning.id});
      const newMeaning = await this.meaningStore.createMeaning({
        vocabId: this.vocabId,
        languageCode: "en",
        text: editedMeaning,
      });
      await this.meaningStore.addMeaningToUser({meaningId: newMeaning.id});
      this.$emit("onMeaningEdited", meaning);
    },
  },
  mounted() {
    this.editedMeanings = this.savedMeanings.map(m => m.text);
  },
  setup() {
    return {
      icons,
      meaningStore: useMeaningStore()
    };
  }
};
</script>

<style scoped>

.user-meanings {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.user-meanings > li > form {
  display: flex;
  flex-direction: row;
  column-gap: 5px;
  justify-content: stretch;
  align-items: center;
}

.user-meanings input {
  width: 100%;
  flex-grow: 1;
}

.delete-user-meaning-button {
  min-width: 25px;
  height: 25px;
  padding: 0;
  background-color: white;
  color: black;
  border: 1px solid grey;
  border-radius: 50%;
}

.delete-user-meaning-button svg {
  color: dimgrey;
  width: 10px;
  height: 10px;
}

.delete-user-meaning-button:hover {
  cursor: pointer;
}

.edit-user-meaning-button {
  min-width: 30px;
  height: 30px;
  padding: 0;
  background-color: #FFD263;
  color: black;
  border: 1px solid #FFD263;
  border-radius: 50%;
}

.edit-user-meaning-button svg {
  width: 10px;
  height: 10px;
}

.edit-user-meaning-button:hover {
  cursor: pointer;
}
</style>
