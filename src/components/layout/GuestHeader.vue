<template>
  <header>
    <router-link :to="{name:'root'}" style="text-decoration: none; color: inherit">
      <h1 class="unselectable">Dzelda</h1>
    </router-link>

    <div id="auth-buttons">
      <router-link :to="{ name: 'sign-up' }">
        <button class="hollow-button capsule-button link">Sign Up</button>
      </router-link>

      <router-link :to="{ name: 'login' }">
        <button class="secondary-filled-button capsule-button link">Login</button>
      </router-link>
    </div>
  </header>
</template>
<script lang="ts">
export default {
  name: "GuestHeader",
  components: {},
};
</script>
<style scoped>
header {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 2vw;
  background-color: var(--primary-color);
  z-index: 5;
}

header h1 {
  color: var(--on-primary-color);
}

header h1:hover {
  text-decoration: none;
}

h1 {
  font: var(--app-title-font);
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
  min-width: 100px;
  border: 1px solid var(--on-primary-color);
}

@media screen and (max-width: 400px) {
  #auth-buttons {
    display: none;
  }
}
</style>
