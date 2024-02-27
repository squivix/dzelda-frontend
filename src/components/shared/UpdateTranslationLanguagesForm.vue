<template>
  <div class="update-tls-form">
    <VueDraggable tag="ol"
                  class="tl-list preferred-tls styled-scrollbars"
                  handle=".preferred-tl"
                  dragClass="invisible"
                  animation="200"
                  :modelValue="preferredTls"
                  @update:modelValue="updatePreferredTlsOrder">
      <li v-for="(translationLanguage,index) in preferredTls" :key="translationLanguage.id" class="tl preferred-tl">
        <div class="icon-text-wrapper">
          <inline-svg :src="icons.dragBars"/>
          <span>{{ translationLanguage.name }}</span>
        </div>
        <div>
          <button class="inv-button remove-button" type="button" v-if="preferredTls.length>1">
            <inline-svg :src="icons.crossRound" v-if="preferredTls.length>1" @click="removeTranslationLanguage(index)"/>
          </button>
        </div>
      </li>
    </VueDraggable>
    <div>
      <button v-if="!isAddingMoreTls" class="inv-button link icon-text-wrapper" type="button" @click="isAddingMoreTls=true">
        <inline-svg :src="icons.plus" class="language-icon"/>
        Add translation language
      </button>
      <form v-else class="select-button-wrapper" @submit.prevent="addTranslationLanguage">
        <select v-model="newPreferredLanguage" required>
          <option disabled value="">Select a language</option>
          <option v-for="translationLanguage in nonPreferredTls" :value="translationLanguage.code">{{ translationLanguage.name }}</option>
        </select>
        <button class="primary-filled-button square-button">Add</button>
      </form>
    </div>
    <SubmitButton type="button" @onClick="submitPreferredTlsUpdate" :isSubmitting="isSubmitting" class="save-button primary-filled-button mid-button square-button" v-if="isDirty">Save</SubmitButton>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {VueDraggableNext as VueDraggable} from "vue-draggable-next";
import {TranslationLanguageSchema} from "dzelda-common";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";
import Footer from "@/components/layout/Footer.vue";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";

export default defineComponent({
  name: "UpdateTranslationLanguagesForm",
  components: {SubmitButton, Footer, VueDraggable, InlineSvg},
  props: {
    sourceLanguageCode: {type: String, required: true},
    preferredTranslationLanguages: {type: Array as PropType<TranslationLanguageSchema[]>, required: true}
  },
  data() {
    return {
      allTranslationLanguages: [] as TranslationLanguageSchema[],
      preferredTls: [] as TranslationLanguageSchema[],
      isAddingMoreTls: false,
      isDirty: false,
      isSubmitting: false,
      newPreferredLanguage: ""
    };
  },
  computed: {
    nonPreferredTls() {
      const preferredSet = new Set(this.preferredTls.map(tl => tl.code));
      return this.allTranslationLanguages.filter(a => !preferredSet.has(a.code));
    }
  }, methods: {
    addTranslationLanguage() {
      this.preferredTls.push(this.allTranslationLanguages.find(tl => tl.code == this.newPreferredLanguage)!);
      this.newPreferredLanguage = "";
      this.isAddingMoreTls = false;
      this.isDirty = true;
    },
    removeTranslationLanguage(index: number) {
      this.preferredTls.splice(index, 1);
      this.isDirty = true;
    },
    updatePreferredTlsOrder(newValue: TranslationLanguageSchema[]) {
      this.preferredTls = newValue;
      this.isDirty = true;
    },
    async submitPreferredTlsUpdate() {
      await this.languageStore.updateUserLanguage({languageCode: this.sourceLanguageCode}, {
        preferredTranslationLanguageCodes: this.preferredTls.map(tl => tl.code)
      });
      this.messageBarStore.addSideMessage({text: "Preferred translation languages saved", type: MessageType.SUCCESS, timeoutMs: 1000});
      this.isDirty = false;
      this.isAddingMoreTls = false;
      this.$emit("onSubmitted");
    }
  },
  async mounted() {
    this.allTranslationLanguages = await this.languageStore.getTranslationLanguages();
    this.preferredTls = [...this.preferredTranslationLanguages,
      // ...this.preferredTranslationLanguages,
      // ...this.preferredTranslationLanguages,
      // ...this.preferredTranslationLanguages,
    ];
  },
  setup() {
    return {icons, languageStore: useLanguageStore(), messageBarStore: useMessageBarStore()};
  }
});
</script>

<style scoped>
.update-tls-form {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.preferred-tls {
  display: flex;
  flex-direction: column;
}

.preferred-tls > :nth-child(even) {
  background-color: var(--zebra-stripe-color);
}

.preferred-tl {
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preferred-tl .icon-text-wrapper {
  padding: 1rem;
  column-gap: 1rem;
}

.remove-button {
  padding: 1rem 1rem;
}

.select-button-wrapper {
  display: flex;
  column-gap: 0.5rem;
}

select {
  font-size: 0.9rem;
  flex-basis: 200px;
}

.save-button {
  align-self: flex-start
}
</style>
