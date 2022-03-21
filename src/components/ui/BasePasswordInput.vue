<template>
  <input :id="id" type="password" :autocomplete="autocomplete" ref="password" />
  <button type="button" @click="toggleShowPassword">
    <font-awesome-icon
      icon="eye"
      ref="toggleShowIcon"
    />
  </button>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    autocomplete: {
      type: String,
      required: true,
    },
  },
  methods: {
    toggleShowPassword() {
      const input = this.$refs.password;
      if (input.type === 'password') {
        input.type = 'text';
        this.$refs.toggleShowIcon.icon.splice(1, 1, 'eye-slash');
        console.log(this.$refs.toggleShowIcon);
      } else {
        input.type = 'password';
        this.$refs.toggleShowIcon.icon.splice(1, 1, 'eye');
      }
    },
  },
};
</script>
<style scoped>
input {
  display: inline-block;
}
button {
  background: none;
  border: none;
}
</style>