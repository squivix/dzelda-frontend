<template>
  <!--                @update:model-value="newValue => $emit('update:modelValue',newValue)"-->
  <BaseDialog :isOpen="isShown" @onDismissed="$emit('onClosed')">
    <LoadingScreen v-if="isLoading"/>
    <form v-else class="edit-dialog-wrapper" @submit.prevent="submitEdit">
      <section>
        <h3 class="heading">Saved Dictionaries</h3>
        <VueDraggable tag="ol"
                      class="dictionary-list saved-dictionaries styled-scrollbars"
                      handle=".saved-dictionary"
                      dragClass="invisible"
                      animation="200"
                      :modelValue="savedDictionaries"
                      @update:modelValue="newValue => savedDictionaries=newValue">
          <p v-if="savedDictionaries!.length==0">No saved dictionaries</p>
          <li v-for="dictionary in savedDictionaries" :key="dictionary.id" class="dictionary saved-dictionary">
            <div class="title-icon-div">
              <div class="icon inv-button">
                <inline-svg :src="icons.dragBars"/>
              </div>
              <p>{{ dictionary.name }}</p>
            </div>
            <button type="button" class="icon inv-button" @click="removeDictionaryFromSaved(dictionary)">
              <inline-svg :src="icons.cross"/>
            </button>
          </li>
        </VueDraggable>
      </section>
      <section>
        <h3 class="heading">Other Dictionaries</h3>
        <ul class="dictionary-list styled-scrollbars">
          <p v-if="otherDictionaries!.length==0">No other dictionaries</p>
          <li v-for="dictionary in otherDictionaries" :key="dictionary.id" class="dictionary" @click="addDictionaryToSaved(dictionary)">
            <div class="title-icon-div">
              <div class="icon inv-button">
                <inline-svg :src="icons.plus"/>
              </div>
              <p>{{ dictionary.name }}</p>
            </div>
          </li>
        </ul>
      </section>
      <div class="buttons-div">
        <button type="button" class="primary-hollow-button mid-button square-button" @click="$emit('onClosed')">Cancel</button>
        <SubmitButton type="submit" :isSubmitting="isSubmitting" class="primary-filled-button mid-button square-button">Save</SubmitButton>
      </div>
    </form>
  </BaseDialog>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseDialog from "@/components/ui/BaseDialog.vue";
import {VueDraggableNext as VueDraggable} from "vue-draggable-next";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {useDictionaryStore} from "@/stores/backend/dictionaryStore.js";
import {DictionarySchema} from "dzelda-common";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";

export default defineComponent({
  name: "EditDictionaryListDialog",
  components: {SubmitButton, LoadingScreen, InlineSvg, BaseDialog, VueDraggable},
  emits: ["onClosed", "onSubmitted"],
  props: {
    isShown: {type: Boolean, required: true},
    languageCode: {type: String, required: true},
  },
  data() {
    return {
      isLoading: true,
      isSubmitting: false,
      allDictionaries: null as DictionarySchema[] | null,
      savedDictionaries: [] as DictionarySchema[]
    };
  },
  watch: {
    isShown() {
      if (this.isShown)
        this.fetchDictionaries();
    },
  },
  computed: {
    otherDictionaries() {
      const savedIdSet = new Set(this.savedDictionaries.map(d => d.id));
      return this.allDictionaries?.filter(d => !savedIdSet.has(d.id));
    }
  },
  methods: {
    async fetchDictionaries() {
      this.isLoading = true;
      this.allDictionaries = await this.dictionaryStore.fetchDictionaries({languageCode: this.languageCode});
      const dictionaryMap: Record<number, DictionarySchema> = {};
      this.allDictionaries!.forEach(d => dictionaryMap[d.id] = d);
      const savedIds = (await this.dictionaryStore.fetchUserDictionaries({languageCode: this.languageCode})).map(d => d.id);
      this.savedDictionaries = savedIds.map(id => dictionaryMap[id]);
      this.isLoading = false;
    },
    addDictionaryToSaved(dictionary: DictionarySchema) {
      this.savedDictionaries.push(dictionary);
    },
    removeDictionaryFromSaved(dictionary: DictionarySchema) {
      this.savedDictionaries.splice(this.savedDictionaries.findIndex(d => d.id === dictionary.id), 1);
    },
    async submitEdit() {
      this.isSubmitting = true;
      await this.dictionaryStore.updateUserLanguageDictionaries({languageCode: this.languageCode}, {
        dictionaryIds: [...this.savedDictionaries!.map(d => d.id)]
      });
      this.isSubmitting = false;
      this.$emit("onSubmitted");
    }
  },
  mounted() {
    this.fetchDictionaries();
  },
  setup() {
    return {
      icons,
      dictionaryStore: useDictionaryStore()
    };
  }
});
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  width: 75vw;
  max-width: 400px;
}

.heading {
  color: var(--panel-new-text-color);
  font-weight: bold;
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
}

.dictionary-list {
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  overflow-y: auto;
  max-height: 30vh;
}

.dictionary {
  background-color: var(--dictionary-item-color);
  color: var(--on-background-color);
  min-height: 50px;
  font-size: 1rem;
  border-radius: 5px;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.icon {
  padding: 0 1rem;
  display: grid;
  place-items: center;
  color: var(--on-background-color);
}

.saved-dictionary {
  justify-content: space-between;
  align-items: stretch;
}

.title-icon-div {
  display: flex;
}

.title-icon-div p {
  align-self: center;
}


.saved-dictionary svg {
  width: 12px;
}

.buttons-div {
  display: flex;
  justify-content: space-between;
  column-gap: 1rem;
}

.buttons-div button {
  flex-grow: 1;
}
</style>
