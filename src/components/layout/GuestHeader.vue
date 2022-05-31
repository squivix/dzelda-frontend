<template>
  <header>
    <router-link to="/" style="text-decoration: none; color: inherit">
      <h1 class="unselectable">FLA</h1>
    </router-link>

    <div id="auth-buttons">
      <router-link :to="{ name: 'sign-up' }">
        <button class="button-hollow link">Sign Up</button>
      </router-link>

      <router-link :to="{ name: 'login' }">
        <button class="secondary-button link">Login</button>
      </router-link>
    </div>
  </header>
</template>
<script>
  export default {
    name: "GuestHeader",
  }
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
  min-width: 105px;
}

.button-hollow {
  color: var(--on-primary-color);
  border-color: var(--on-secondary-color);
}

@media screen and (max-width: 400px) {
  #auth-buttons {
    display: none;
  }
}
</style>