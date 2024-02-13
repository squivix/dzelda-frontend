<template>
  <section>
    <h2>Start learning now</h2>
    <div class="buttons-div">
      <router-link :to="{ name: 'sign-up' }">
        <button class="primary-filled-button big-button capsule-button link">Sign Up</button>
      </router-link>

      <router-link :to="{ name: 'login' }">
        <button class="secondary-filled-button big-button capsule-button link">Login</button>
      </router-link>
    </div>
  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "SignUpSection"
});
</script>

<style scoped>
section {
  margin-top: 5vh;
  margin-bottom: 25vh;
}

h2 {
  font-size: 2.25rem;
  margin-bottom: 2rem;
  text-align: center;
}

.buttons-div {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  column-gap: min(2vw, 15px);
}
</style>
