<template>
  <BaseDialog :isOpen="isShown">
    <LoadingScreen v-if="!defaultTranslationLanguages||!language"/>
    <div class="start-learning-dialog" v-else>
      <h4>Translation languages</h4>
      <p>
        Which languages do you want to translate {{ language.name }} to?
      </p>
      <UpdateTranslationLanguagesForm :sourceLanguageCode="language.code" @onSubmitted="" :enabled="isShown">
        <template v-slot:save-button="{preferredTls}">
          <p>
            (You can always change this in the settings)
          </p>
          <div class="buttons-div">
            <button class="square-button big-button primary-hollow-button" @click="$emit('onCanceled')">Cancel</button>
            <SubmitButton :isSubmitting="isSubmitting"
                          class="square-button big-button primary-filled-button"
                          @click="startLearningLanguage(preferredTls)">
              Start learning {{ language.name }}
            </SubmitButton>
          </div>
        </template>
      </UpdateTranslationLanguagesForm>
    </div>
  </BaseDialog>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import BaseDialog from "@/components/ui/BaseDialog.vue";
import UpdateTranslationLanguagesForm from "@/components/shared/UpdateTranslationLanguagesForm.vue";
import type {LanguageSchema, TranslationLanguageSchema} from "dzelda-common";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";

export default defineComponent({
  name: "StartLearningDialog",
  emits: ["onCanceled", "onSubmitted"],
  components: {SubmitButton, LoadingScreen, UpdateTranslationLanguagesForm, BaseDialog},
  props: {
    language: {type: Object as PropType<LanguageSchema | null>},
    isShown: {type: Boolean},
  },
  data() {
    return {
      defaultTranslationLanguages: [] as TranslationLanguageSchema[],
      isSubmitting: false,
    };
  },
  methods: {
    async startLearningLanguage(preferredTls: TranslationLanguageSchema[]) {
      if (!this.language)
        return;
      this.isSubmitting = true;
      await this.languageStore.addLanguageToUser({
        languageCode: this.language!.code,
        preferredTranslationLanguageCodes: preferredTls.map(tl => tl.code)
      });
      await this.languageStore.fetchUserLanguages({ignoreCache: true});
      this.isSubmitting = false;
      this.$emit("onSubmitted");
    },
  },
  setup() {
    return {
      languageStore: useLanguageStore(),
    };
  }
});
</script>

<style scoped>
.start-learning-dialog {
  width: 75vw;
  max-width: 500px;
  display: flex;
  flex-direction: column;
}

.buttons-div {
  display: flex;
  column-gap: 0.5rem;
  justify-content: space-between;
}

button {
  padding: 0.5rem 1rem;
  flex: 1;
  flex-basis: 200px;
}

h4 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

p {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

@media screen and (max-width: 400px) {
  .buttons-div {
    flex-wrap: wrap-reverse;
    row-gap: 0.5rem;
  }
}
</style>
