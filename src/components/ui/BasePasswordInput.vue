<template>
  <div class="base-password-input">
    <input
      :id="id"
      type="password"
      :autocomplete="autocomplete"
      ref="password"
    />
    <button type="button" @click="toggleShowPassword">
      <font-awesome-icon
        :icon="shown ? 'eye-slash' : 'eye'"
        ref="toggleShowIcon"
      />
    </button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      shown: false,
    };
  },
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
      } else {
        input.type = 'password';
      }
      this.shown = !this.shown;
    },
  },
};
</script>
<style scoped>
div{
  position: relative;
}
input {
  width: 100%;
  outline: none;
  margin: 0;
  padding: 0;
  
}
button {
  background: none;
  border: none;
  position: absolute;
  top: 3px;
  right: 7px;
  bottom: 3px;
  z-index: 2;
  padding: 0;
}

</style>