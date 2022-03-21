<template>
  <div>
    <guest-header></guest-header>
    <router-view></router-view>
    <div>
      <p></p>
    </div>
  </div>
</template>
<script>
import GuestHeader from "./components/layout/GuestHeader.vue";
export default {
  components: {
    GuestHeader,
  },
};
</script>

<style>
@import "./assets/styles/reset.css";

:root {
  --primary-color: #0288d1;
  --primary-color-light: #5eb8ff;
  --primary-color-dark: #005b9f;
  --secondary-color: #43a047;
  --secondary-color-light: #76d275;
  --secondary-color-dark: #00701a;

  --on-primary-color: #ffffff;
  --on-secondary-color: #ffffff;
  --border-color: lightgray;

  --app-title-font: 900 2rem sans-serif;

  font-family: sans-serif;
}

input:not([type="submit"]) {
  height: 1.25rem;
}

.secondary-button {
  background: var(--secondary-color);
  padding: 10px 20px;
  border: 1px solid var(--on-secondary-color);
  color: var(--on-secondary-color);
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
}

.button-hollow {
  background: transparent;
  padding: 10px 20px;
  border-width: 1px;
  border-style: solid;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
}

a {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

.link {
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
  cursor: pointer;
}
.unselectable {
  user-select: none;
}
</style>