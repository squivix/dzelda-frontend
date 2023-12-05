<template>
  <BaseCard title="Resend Confirmation Email" id="resend-confirm-email-card">
    <template v-slot:content>
      <form @submit.prevent="submitResendForm">
        <label for="email">Email</label>
        <BaseChangeableInput id="email"
                             type="email"
                             required
                             maxlength="256"
                             class="base-changeable-input-div"
                             v-model="email"
                             :clear-on-change="true"
                             @onChange="()=>emailChanged=true">
        </BaseChangeableInput>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <SubmitButton id="confirm-email-button"
                      class="primary-filled-button capsule-button"
                      type="submit"
                      :is-submitting="isSubmitting">
          Resend Confirmation Email
        </SubmitButton>

      </form>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseChangeableInput from "@/components/ui/BaseChangeableInput.vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import BaseCard from "@/components/ui/BaseCard.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";

export default defineComponent({
  name: "ResendConfirmEmailPage",
  components: {SubmitButton, BaseChangeableInput, BaseCard},
  data() {
    return {
      //@ts-ignore store type not recognized in data due to bad vue support :(
      email: this.userStore.userAccount.email,
      errorMessage: "",
      emailChanged: false,
      isSubmitting: false,
    };
  },
  methods: {
    async submitResendForm() {
      this.errorMessage = "";
      this.isSubmitting = true;
      const response = await this.userStore.requestEmailConfirmToken({email: this.emailChanged ? this.email : undefined});
      this.isSubmitting = false;

      if (response.ok)
        this.$router.push({name: "confirm-email-sent"});
      else {
        const error = response.error;
        if (error.code == 400)
          this.errorMessage = (error.fields as { email: string }).email;
      }
    }
  },
  beforeRouteEnter() {
    const userStore = useUserStore();
    if (userStore.userAccount!.isEmailConfirmed)
      return {name: "home"};
  },
  setup() {
    return {
      userStore: useUserStore(),
    };
  }
});
</script>

<style scoped>
#resend-confirm-email-card {
  width: 80vw;
  max-width: 800px;
  display: block;
  margin: auto;
}


form {
  display: flex;
  flex-direction: column;
  margin-right: 0;
  padding: 0 10%;
}

label {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.base-changeable-input-div {
  margin-bottom: 0.5rem;
}

#confirm-email-button {
  margin-top: 1rem;
}

a {
  text-decoration: underline;
  color: blue;
}

a:hover {
  cursor: pointer;
}
</style>
