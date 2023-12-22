<template>
  <tr>
    <td>{{ language.name }}</td>
    <td>{{ addedOn }}</td>
    <td>
      <SubmitButton class="inv-button link"
                    @click="onRemoveLanguageClicked"
                    :is-submitting="isSubmittingRemoveLanguage">
        Remove
      </SubmitButton>
      <!--          TODO reset progress-->
      <!--          <button class="inv-button link" @click="resetLanguageProgress">Reset Progress</button>-->
    </td>
  </tr>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import {LearnerLanguageSchema} from "dzelda-types";

export default defineComponent({
  name: "LanguageRow",
  components: {SubmitButton},
  emits: ["onRemoveLanguageClicked"],
  props: {language: {type: Object as PropType<LearnerLanguageSchema>, required: true}},
  data() {
    return {
      isSubmittingRemoveLanguage: false
    };
  },
  computed: {
    addedOn() {
      return this.language.addedOn.split("T")[0];
    }
  },
  methods: {
    async onRemoveLanguageClicked() {
      this.isSubmittingRemoveLanguage = true;
      this.$emit("onRemoveLanguageClicked", this.language);
    }
  }
});
</script>

<style scoped>

td {
  padding: 0.25rem;
}
</style>
