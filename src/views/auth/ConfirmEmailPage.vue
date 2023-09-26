<template>
  <base-card :title="resend?'Resend Confirmation Email':'Check Your Email'" id="confirm-email-card">
    <template v-slot:content>
      <form @submit.prevent="submitResendForm" v-if="resend">
        <label for="email">Email</label>
        <base-changeable-input id="email"
                               type="email"
                               required
                               v-model="email"
                               :clear-on-change="true"
                               @onChange="()=>emailChanged=true">
        </base-changeable-input>

        <button id="confirm-email-button" class="primary-button" type="submit">
          Resend Confirmation Email
        </button>

      </form>
      <p class="submit-message" v-else-if="!queryParams.token">
        We've sent you a confirmation link. Please check your email.
        <br><br>
        Didn't receive the email? Link expired?
        <a @click.prevent="()=>resend=true">Click here to resend</a>
      </p>
      <p class="submit-message" v-else>
        Confirming...
        <br><br>
        You will be redirected shortly.
      </p>

    </template>
  </base-card>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseChangeableInput from "@/components/ui/BaseChangeableInput.vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import {useAuthStore} from "@/stores/backend/authStore.js";
import {useQuery} from "@oarepo/vue-query-synchronizer";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";

export default defineComponent({
  name: "ConfirmEmailPage",
  components: {BaseChangeableInput},
  data() {
    return {
      //@ts-ignore store type not recognized in data due to bad vue support :(
      email: this.userStore.userAccount.email,
      emailChanged: false,
      resend: false,
    };
  },
  methods: {
    async submitResendForm() {
      await this.authStore.requestEmailConfirmToken({email: this.emailChanged ? this.email : undefined});
      this.resend = false;
    }
  },
  beforeRouteEnter() {
    const userStore = useUserStore();
    if (userStore.userAccount!.isEmailConfirmed)
      return {name: "explore"};
  },
  async mounted() {
    if (typeof this.queryParams.token !== "string" || this.queryParams.token === "")
      this.queryParams.token = undefined;
    else {
      const isConfirmSuccessful = await this.authStore.confirmEmail({token: this.queryParams.token});
      if (isConfirmSuccessful)
        this.$router.push({name: "explore"});
      else {
        this.queryParams.token = undefined;
        this.resend = true;
        this.messageBarStore.addMessage({type: MessageType.ERROR, text: "Email reset token is invalid or expired"});
      }
    }
  },
  setup() {
    return {
      userStore: useUserStore(),
      authStore: useAuthStore(),
      messageBarStore: useMessageBarStore(),
      queryParams: useQuery()
    };
  }
});
</script>

<style scoped>

#confirm-email-card {
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

input {
  border: none;
  outline: 1px solid black;
}

input {
  margin-bottom: 1.5rem;
}

#confirm-email-button {
  margin-top: 1rem;
}

.submit-message {
  min-height: 1lh;
}

a {
  text-decoration: underline;
  color: blue;
}

a:hover {
  cursor: pointer;
}
</style>
