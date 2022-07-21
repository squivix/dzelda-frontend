<template>
    <div class="dropdown">
        <label :for="`dropdown-checkbox-${label}-${componentId}`" class="dropdown-label link">
            <slot name="button">

            </slot>
        </label>

        <input :id="`dropdown-checkbox-${label}-${componentId}`" type="checkbox" class="dropdown-checkbox"
               v-model="shown">
        <!--TODO: fix clickable when hidden-->

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
                required: false,
                default: "",
            }
        },
        data() {
            return {
                shown: false,
                componentId: Math.random(),
            }
        },
        watch: {
            '$route.path'() {
                this.shown = false;
            }
        }
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
        opacity: 0;
        text-align: center;
        transition: opacity .4s ease;
        border: 1px solid gray;
        border-radius: 5px;
        background-color: var(--on-primary-color);
    }

    .dropdown-checkbox {
        position: absolute;
        opacity: 0;
        height: 0;
        width: 0;
    }

    .dropdown-checkbox:checked + .menu {
        opacity: 1;
    }

</style>