<template>
  <base-card title="Resend Confirmation Email" id="resend-confirm-email-card">
    <template v-slot:content>
      <form @submit.prevent="submitResendForm">
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
    </template>
  </base-card>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseChangeableInput from "@/components/ui/BaseChangeableInput.vue";
import {useUserStore} from "@/stores/backend/userStore.js";

export default defineComponent({
  name: "ResendConfirmEmailPage",
  components: {BaseChangeableInput},
  data() {
    return {
      //@ts-ignore store type not recognized in data due to bad vue support :(
      email: this.userStore.userAccount.email,
      emailChanged: false,
    };
  },
  methods: {
    async submitResendForm() {
      await this.authStore.requestEmailConfirmToken({email: this.emailChanged ? this.email : undefined});
      this.$router.push({name: "confirm-email-sent"});
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
