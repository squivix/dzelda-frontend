<template>
    <div class="top-bar">
        <form @submit.prevent="onSearchSubmitted" class="search-form">
            <input type="text" class="search-input" placeholder="Search" v-model.trim="searchQuery">
            <button class="search-button">
                <font-awesome-icon icon="magnifying-glass"></font-awesome-icon>
            </button>
        </form>
        <button class="filter-button" @click.stop="toggleFilters">
            <font-awesome-icon icon="filter"></font-awesome-icon>
        </button>
    </div>
    <form :class="{filters:true, 'filter-shown':isFiltersShown}" @submit.prevent="onFilterApplied">
        <slot name="filters">

        </slot>
        <button class="apply-filters">Apply</button>
    </form>
</template>

<script>
    import {VOCAB_LEVELS} from "@/constants";

    export default {
        name: "SearchFilter",
        emits: ['onSearchSubmitted', 'onFilterApplied'],
        props: {
            initialSearchQuery: {
                type: String,
                required: false,
                default: null,
            }
        },
        data() {
            return {
                searchQuery: this.initialSearchQuery,
                isFiltersShown: false,
            };
        },
        computed: {
            vocabLevels() {
                return VOCAB_LEVELS;
            },
        },
        methods: {
            toggleFilters() {
                this.isFiltersShown = !this.isFiltersShown;
            },
            onSearchSubmitted() {
                this.$emit('onSearchSubmitted', this.searchQuery);
            },
            onFilterApplied() {
                this.$emit('onFilterApplied');
            }
        }
    }
</script>

<style scoped>
    .top-bar {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        column-gap: 0.5vw;
    }

    .search-form {
        display: flex;
        flex-direction: row;
        column-gap: 0.2vw;
    }

    .search-button {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: var(--primary-color);
        border: 1px solid var(--on-primary-color);
    }

    .search-button svg {
        color: var(--on-primary-color);
    }

    .filter-button {
        border: 2px solid gray;
        border-radius: 5px;
        height: 30px;
    }

    .filter-button:hover {
        cursor: pointer;
    }

    .filters {
        display: flex;
        flex-direction: column;
        row-gap: 0.5rem;
        align-self: flex-end;
        border: 1px solid gray;
        border-radius: 5px;
        padding: 1rem;
        transition-property: max-height, border-color, padding;
        transition-delay: 0s, 0.5s;
        transition-duration: 0.5s, 0.001s;
    }

    .filter-shown {
        max-height: 500px;
        transition-delay: 0.01s, 0s;
        transition-duration: 1s, 0.001s;
    }

    .filters:not(.filter-shown) {
        max-height: 0;
        padding-top: 0;
        padding-bottom: 0;
        border: 1px solid transparent;
    }


    .apply-filters {
        align-self: flex-end;
        border-radius: 3px;
        padding: 0.5rem 0.5rem;
        font-size: 1rem;
        background-color: var(--primary-color);
        color: var(--on-primary-color);
        border: 1px solid var(--primary-color)
    }

    .apply-filters:hover {
        cursor: pointer;
    }
</style>
<style>
    .filters:not(.filter-shown) * {
        visibility: hidden;
        transition: visibility 0.4s;
        pointer-events: none;
    }
</style>