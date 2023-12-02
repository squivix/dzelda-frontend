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
          <BaseChangeableInput id="email" type="email" autocomplete="email" required v-model="newEmail"
                               :clear-on-change="true" @on-change="()=>emailChanged=true"
                               :class="{'error-input': errorFields.includes('newEmail')}"/>
          <SubmitButton v-if="emailChanged"
                        type="submit"
                        class="change-email-button primary-filled-button capsule-button"
                        :is-submitting="isSubmitting">
            Change Email
          </SubmitButton>
        </div>
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

export default defineComponent({
  name: "ChangeEmailSection",
  components: {SubmitButton, BaseChangeableInput},
  data() {
    return {
      emailChangeSuccess: false,
      emailChanged: false,
      errorFields: [] as Array<"newEmail">,
      //@ts-ignore store type not recognized in data due to bad vue support :(
      newEmail: this.userStore.userAccount!.email,
      isSubmitting: false,
    };
  },
  methods: {
    async submitEmailChange() {
      this.isSubmitting = true;
      const error = await this.userStore.changeEmail({newEmail: this.newEmail});
      this.isSubmitting = false;
      if (error !== undefined && error.code == 400) {
        this.messageBarStore.addMessage({text: error.message, type: MessageType.ERROR});
        this.errorFields = Object.keys(error.fields!) as Array<"newEmail">;
      } else
        this.emailChangeSuccess = true;
    },
  },
  setup() {
    return {
      userStore: useUserStore(),
      messageBarStore: useMessageBarStore()
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
