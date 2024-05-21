<template>
  <div class="update-tls-form">
    <div>
      <BaseMessageBar v-if="!preferredTls.some(tl=>tl.isDefault)"
                      :message="{uuid:randomUUID(), text:'We recommend English if you speak it as it has the most translations', type:MessageType.WARNING,isDismissable:false, isMarkdown:true}"/>
      <VueDraggable tag="ol"
                    class="preferred-tls styled-scrollbars"
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
    </div>
    <div>
      <button v-if="!isAddingMoreTls" class="add-more-button inv-button link icon-text-wrapper" type="button" @click="isAddingMoreTls=true">
        <inline-svg :src="icons.plus" class="plus-icon"/>
        Add another language
      </button>
      <form v-else class="add-more-form" @submit.prevent="addTranslationLanguage">
        <div class="select-button-wrapper">
          <select v-model="newPreferredLanguage" required>
            <option disabled value="">Select a language</option>
            <option v-for="translationLanguage in nonPreferredTls" :value="translationLanguage.code">{{ translationLanguage.name }}</option>
          </select>
          <button class="add-button primary-filled-button square-button">Add</button>
        </div>
        <a href="https://forms.gle/LV2VHznfopMnJWZT6" class="suggest-link" target="_blank">
          <inline-svg :src="googleFormsLogo"/>
          Is your language not listed?<br>Suggest it here
        </a>
      </form>
    </div>
    <slot name="save-button" :preferredTls="preferredTls">
      <SubmitButton v-if="isDirty"
                    type="button"
                    @onClick="$emit('onSubmitted', preferredTls)"
                    :isSubmitting="isSubmitting"
                    class="save-button primary-filled-button mid-button square-button">
        Save
      </SubmitButton>
    </slot>
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
import googleFormsLogo from "@/assets/images/google-forms-logo.svg";
import BaseMessageBar from "@/components/ui/BaseMessageBar.vue";

export default defineComponent({
  name: "UpdateTranslationLanguagesForm",
  components: {BaseMessageBar, SubmitButton, Footer, VueDraggable, InlineSvg},
  props: {
    initialPreferredTls: {type: Array as PropType<TranslationLanguageSchema[]>, required: false},
    enabled: {type: Boolean, default: true},
    isSubmitting: {type: Boolean, default: false},
  },
  watch: {
    isSubmitting(newVal: boolean, oldVal: boolean) {
      if (!newVal && oldVal)
        this.isDirty = false;
    },
    async enabled() {
      if (!this.enabled) {
        this.preferredTls = [...(this.initialPreferredTls ?? this.defaultTranslationLanguages)];
        this.isAddingMoreTls = false;
        this.isDirty = false;
      }
    }
  },
  data() {
    return {
      allTranslationLanguages: [] as TranslationLanguageSchema[],
      preferredTls: [] as TranslationLanguageSchema[],
      isAddingMoreTls: false,
      isDirty: false,
      newPreferredLanguage: ""
    };
  },
  computed: {
    nonPreferredTls() {
      const preferredSet = new Set(this.preferredTls.map(tl => tl.code));
      return this.allTranslationLanguages.filter(a => !preferredSet.has(a.code));
    },
    defaultTranslationLanguages() {
      return this.allTranslationLanguages.filter(tl => tl.isDefault);
    }
  },
  methods: {
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
  },
  async mounted() {
    this.allTranslationLanguages = await this.languageStore.getTranslationLanguages();
    this.preferredTls = [...(this.initialPreferredTls ?? this.defaultTranslationLanguages)];
  },
  setup() {
    return {
      icons, googleFormsLogo,
      languageStore: useLanguageStore(),
      messageBarStore: useMessageBarStore(),
      MessageType,
      randomUUID: () => crypto.randomUUID()
    };
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
  max-height: 250px;
  overflow-y: auto;
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


.add-more-button {
  font-size: 1rem;
  column-gap: 0.75rem;
}

.suggest-link {
  display: flex;
  column-gap: 0.25rem;
  align-items: center;
  color: var(--on-background-color);
  font-weight: bold;
  align-self: flex-start;
}

.suggest-link svg {
  width: 30px;
  height: 30px;
}

.add-more-form {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.add-button {
  flex-basis: 60px;
}
</style>
