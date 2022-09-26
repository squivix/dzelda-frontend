<template>
  <h5 v-if="savedMeanings.length>0">Saved Meanings</h5>
  <ol class="user-meanings">
    <li v-for="meaning in savedMeanings" :key="meaning.id">
      <form action="javascript:void(0);">
        <button class="delete-user-meaning-button" @click="deleteMeaning(meaning)" type="button">
          <font-awesome-icon icon="x" ref="toggleShowIcon" class="fa-xs"/>
        </button>
        <input :value="meaning.text" :ref="`user-meaning-input-${meaning.id}`"/>
        <button class="edit-user-meaning-button" @click="editMeaning(meaning)" type="submit">
          <font-awesome-icon icon="check" ref="toggleShowIcon" class="fa-xs"/>
        </button>
      </form>
    </li>
  </ol>
</template>

<script>
import {useMeaningStore} from "@/stores/meaning.js";

export default {
  name: "MeaningEditingControls",
  components: {},
  emits: ["onMeaningDeleted"],
  props: {
    vocabId: {
      type: Number,
      required: true
    },
    savedMeanings: {
      type: Array,
      required: true
    }
  },
  methods: {
    async deleteMeaning(meaning) {
      await this.meaningStore.deleteMeaningFromUser({
        meaningId: meaning.id
      });
      this.$emit("onMeaningDeleted", meaning);
    },
    async editMeaning(meaning) {
      const editedMeaning = this.$refs[`user-meaning-input-${meaning.id}`][0].value.trim();
      if (editedMeaning === undefined || editedMeaning === "")
        await this.deleteMeaning(meaning)
      else if (editedMeaning === meaning.text)
        return;

      await this.meaningStore.deleteMeaningFromUser({meaningId: meaning.id})
      const newMeaning = await this.meaningStore.createMeaning({
        vocabId: this.vocabId,
        languageCode: "en",
        text: editedMeaning,
      })
      await this.meaningStore.addMeaningToUser({meaningId: newMeaning.id});
    },
  },
  created() {
    this.meaningStore = useMeaningStore();
  }
}
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
  min-width: 20px;
  height: 20px;
  padding: 0;
  background-color: white;
  color: black;
  border: 1px solid gray;
  border-radius: 50%;
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

.edit-user-meaning-button:hover {
  cursor: pointer;
}
</style>