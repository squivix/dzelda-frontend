<template>
  <BaseDialog :isOpen="isShown" class="report-dialog" @onClosingTransitionEnd="clearForm">
    <form @submit.prevent="submitReport">
      <div class="form-row">
        <label>Reason for reporting</label>
        <select v-model="reasonCategory" required>
          <option value="" disabled>Select a reason</option>
          <option value="copyright-infringement">Copyright Infringement</option>
          <option value="inappropriate-content">Inappropriate Content</option>
          <option value="other">Other</option>
        </select>
        <input type="text" v-if="reasonCategory=='other'" placeholder="Enter reason for reporting" required :maxlength="500" v-model="otherReason">
      </div>
      <div class="form-row">
        <textarea placeholder="Additional note" maxlength="5000" style="resize:none" v-model="reportText"></textarea>
      </div>
      <label class="checkbox-label">
        <input type="checkbox" v-model="hideText">
        Hide text from your feed
      </label>
      <div class="buttons-div">
        <button class="primary-hollow-button square-button no-button" type="button" @click="$emit('onCancelClicked')">Cancel</button>
        <button class="primary-filled-button square-button yes-button" type="submit">Submit</button>
      </div>
    </form>
  </BaseDialog>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import BaseDialog from "@/components/ui/BaseDialog.vue";
import {useTextStore} from "@/stores/backend/textStore.js";
import {TextSchema} from "dzelda-common";

export default defineComponent({
  name: "ReportTextDialog",
  components: {BaseDialog},
  emits: ["onCancelClicked", "onReportSubmitted"],
  props: {
    isShown: {type: Boolean, required: true},
    text: {type: Object as PropType<TextSchema | null>},
  },
  data() {
    return {
      reasonCategory: "",
      otherReason: "",
      reportText: "",
      hideText: true,
    };
  },
  computed: {
    reasonForReporting() {
      if (this.reasonCategory == "other")
        return this.otherReason;
      return this.reasonCategory;
    },
  },
  methods: {
    async submitReport() {
      if (!this.text)
        return;
      await this.textStore.reportText({textId: this.text.id}, {
        reasonForReporting: this.reasonForReporting,
        reportText: this.reportText,
        hideText: this.hideText
      });
      this.$emit("onReportSubmitted");
    },
    clearForm() {
      this.reasonCategory = "";
      this.otherReason = "";
      this.reportText = "";
      this.hideText = true;
    }
  },
  setup() {
    return {
      textStore: useTextStore()
    };
  }
});
</script>

<style scoped>
.report-dialog {
  display: flex;
  flex-direction: column;
  min-width: 250px;
  max-width: 500px;
  width: 60vw;
}

.buttons-div {
  display: flex;
  justify-content: flex-end;
  column-gap: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
}

textarea {
  resize: none;
  height: 20vh;
}
</style>
