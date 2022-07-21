<template>
    <div class="dropdown">
        <label :for="`dropdown-checkbox-${label}`" class="dropdown-label link">
            <slot name="button">

            </slot>
        </label>

        <input :id="`dropdown-checkbox-${label}`" type="checkbox" class="dropdown-checkbox" v-model="shown">
        <component :is="isPointy?'base-pointy-div':'div'" class="menu">
            <slot name="menu">
            </slot>
        </component>
    </div>
</template>

<script>

    import BasePointyDiv from "@/components/ui/BasePointyDiv";

    export default {
        name: "BaseDropDown",
        components: {BasePointyDiv},
        props: {
            isPointy: {
                type: Boolean,
                required: false,
                default: false,
            },
            label: {
                type: String,
                required: true,
            }
        },
        data() {
            return {
                shown: false,
            }
        },
        watch: {
            '$route.path'() {
                this.shown = false;
            }
        },
    }
</script>

<style scoped>
    .dropdown {
        position: relative;
    }

    .menu {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translate(-50%, 10px);
        text-align: center;
        border: 1px solid gray;
        border-radius: 5px;
        background-color: var(--on-primary-color);
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.4s linear, visibility 0s linear 0.4s;
    }

    .dropdown-checkbox {
        position: absolute;
        opacity: 0;
        height: 0;
        width: 0;
    }

    .dropdown-checkbox:checked + .menu {
        visibility: visible;
        opacity: 1;
        transition-delay: 0s;
    }

</style>