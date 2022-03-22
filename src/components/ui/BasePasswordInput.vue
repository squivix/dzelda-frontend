<template>
  <div class="base-password-div">
    <input
      :id="id"
      type="password"
      :autocomplete="autocomplete"
      ref="password"
      :required="required"
      :value="modelValue"
      @input="onInput"
      class="base-password-input"
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
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    modelValue: String,
  },
  emits: ['update:modelValue'],
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
    onInput(event) {
      this.$emit('update:modelValue', event.target.value);
    },
  },
};
</script>
<style scoped>
div {
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