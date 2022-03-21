<template>
  <base-card title="Sign Up">
    <template v-slot:content>
      <form>
        <label for="email">Email</label>
        <input id="email" type="email" />
        <label for="username">Username</label>
        <input id="username" type="text" />
        <label for="new-password">Password</label>
        <base-password-input
          id="new-password"
          autocomplete="new-password"
        ></base-password-input>
      </form>
    </template>
  </base-card>
</template>
<script>
export default {};
</script>