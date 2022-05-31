<template>
    <div class="base-password-div">
        <input
                type="password"
                ref="password"
                v-bind="$attrs"
                :value="modelValue"
                @input="onInput"
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
        name: "BasePasswordInput",
        components: {},
        inheritAttrs: false,
        props: {
            modelValue: String,
        },
        data() {
            return {
                shown: false,
            };
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