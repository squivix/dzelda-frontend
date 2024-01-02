<template>
  <header>
    <div class="main-header">
      <router-link :to="{name:'root'}" style="text-decoration: none; color: inherit">
        <router-link :to="{ name: 'home'}" class="title">
          <img :src="logo" class="logo-image" alt="logo">
          <!--        <h1>Dzelda</h1>-->
        </router-link>
      </router-link>

      <div id="auth-buttons">
        <router-link :to="{ name: 'sign-up' }">
          <button class="hollow-button capsule-button link">Sign Up</button>
        </router-link>

        <router-link :to="{ name: 'login' }">
          <button class="secondary-filled-button capsule-button link">Login</button>
        </router-link>
      </div>
    </div>
  </header>
</template>
<script lang="ts">
import logo from "@/assets/images/logo.png";

export default {
  name: "GuestHeader",
  components: {},
  setup() {
    return {
      logo,
    };
  },
};
</script>
<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 5;
}

.main-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 2vw;
  background-color: var(--primary-color);
}

h1 {
  color: var(--on-primary-color);
}

h1:hover {
  text-decoration: none;
}

h1 {
  font: 900 2rem sans-serif;
}

.logo-image {
  width: 64px;
  height: 64px;
  background-color: transparent;
  margin: 10px 0;
}

#auth-buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  column-gap: min(2vw, 15px);
}

button a {
  color: inherit;
}

button {
  border: 1px solid var(--on-primary-color);
}

</style>
