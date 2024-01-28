<template>
  <section>
    <h3>Change Email</h3>
    <form class="change-email-form" @submit.prevent="submitEmailChange">
      <p v-if="emailChangeSuccess">
        We've sent you an email with a confirmation link.
        <br><br>
        Please confirm your new email within 24 hours for the change to be applied.
      </p>
      <template v-else>
        <label for="email">Email</label>
        <div>
          <BaseChangeableInput id="email" type="email" autocomplete="email" maxlength="256" required v-model="newEmail"
                               :clear-on-change="true" @on-change="()=>emailChanged=true"
                               :class="{'error-input': !!errorMessage}"/>
          <SubmitButton v-if="emailChanged"
                        type="submit"
                        class="change-email-button primary-filled-button mid-button capsule-button"
                        :is-submitting="isSubmitting">
            Change Email
          </SubmitButton>
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </template>
    </form>
  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseChangeableInput from "@/components/ui/BaseChangeableInput.vue";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";
import {useUserStore} from "@/stores/backend/userStore.js";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import BasePasswordInput from "@/components/ui/BasePasswordInput.vue";

export default defineComponent({
  name: "ChangeEmailSection",
  components: {BasePasswordInput, SubmitButton, BaseChangeableInput},
  data() {
    return {
      emailChangeSuccess: false,
      emailChanged: false,
      errorMessage: "",
      //@ts-ignore store type not recognized in data due to bad vue support :(
      newEmail: this.userStore.userAccount!.email,
      isSubmitting: false,
    };
  },
  methods: {
    async submitEmailChange() {
      this.isSubmitting = true;
      const response = await this.userStore.changeEmail({newEmail: this.newEmail});
      this.isSubmitting = false;
      if (!response.ok && response?.error?.code == 400)
        this.errorMessage = (response.error.fields! as { email: string }).email;
      else
        this.emailChangeSuccess = true;
    },
  },
  setup() {
    return {
      userStore: useUserStore(),
    };
  }
});
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.change-email-form > div {
  display: flex;
  column-gap: 0.5rem;
}


.change-email-form > div :nth-child(1) {
  flex-grow: 1;
}

.change-email-button {
  font-size: 0.75rem;
}

</style>
