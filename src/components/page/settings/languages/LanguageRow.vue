<template>
  <tr>
    <td>{{ language.name }}</td>
    <td>{{ addedOn }}</td>
    <td class="actions-cell">
      <SubmitButton class="inv-button link"
                    @click="onRemoveLanguageClicked"
                    :enabled="!isButtonsDisabled"
                    :isSubmitting="isSubmittingRemoveLanguage">
        Remove
      </SubmitButton>
      <SubmitButton class="inv-button link"
                    @click="onResetLanguageClicked"
                    :enabled="!isButtonsDisabled"
                    :isSubmitting="isSubmittingResetLanguage">
        Reset Progress
      </SubmitButton>
    </td>
  </tr>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import {LearnerLanguageSchema} from "dzelda-common";

export default defineComponent({
  name: "LanguageRow",
  components: {SubmitButton},
  emits: ["onRemoveLanguageClicked", "onResetLanguageClicked"],
  props: {
    language: {type: Object as PropType<LearnerLanguageSchema>, required: true},
    isButtonsDisabled: {type: Boolean, default: false},
    isSubmittingRemoveLanguage: {type: Boolean, default: false},
    isSubmittingResetLanguage: {type: Boolean, default: false}
  },
  computed: {
    addedOn() {
      return new Date(this.language.startedLearningOn).toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "numeric"
      });
    }
  },
  methods: {
    onRemoveLanguageClicked() {
      this.$emit("onRemoveLanguageClicked", this.language);
    },
    onResetLanguageClicked() {
      this.$emit("onResetLanguageClicked", this.language);
    }
  }
});
</script>

<style scoped>

td {
  padding: 0.25rem;
}

.actions-cell {
  display: flex;
  column-gap: 1rem;
}
</style>
