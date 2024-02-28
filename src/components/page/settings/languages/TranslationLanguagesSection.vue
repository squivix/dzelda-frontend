<template>
  <section>
    <h3>Translation Languages</h3>
    <UpdateTranslationLanguagesForm :initialPreferredTls="language.preferredTranslationLanguages" @onSubmitted="updateTranslationLangs" :isSubmitting="isSubmitting"/>
  </section>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import UpdateTranslationLanguagesForm from "@/components/shared/UpdateTranslationLanguagesForm.vue";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {LearnerLanguageSchema, TranslationLanguageSchema} from "dzelda-common";

export default defineComponent({
  name: "TranslationLanguagesSection",
  components: {UpdateTranslationLanguagesForm},
  props: {
    language: {type: Object as PropType<LearnerLanguageSchema>, required: true},
  },
  data() {
    return {isSubmitting: false};
  },
  methods: {
    async updateTranslationLangs(preferredTls: TranslationLanguageSchema[]) {
      this.isSubmitting = true;
      await this.languageStore.updateUserLanguage({languageCode: this.language.code}, {
        preferredTranslationLanguageCodes: preferredTls.map(tl => tl.code)
      });
      this.isSubmitting = false;
      this.messageBarStore.addSideMessage({text: "Preferred translation languages saved", type: MessageType.SUCCESS, timeoutMs: 3000});
    }
  },
  setup() {
    return {
      languageStore: useLanguageStore(),
      messageBarStore: useMessageBarStore()
    };
  }
});
</script>

<style scoped>
h3 {
  font-size: 1.5rem;
}


section {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  width: 75vw;
  max-width: 400px;
}

</style>
