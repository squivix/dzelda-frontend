<template>
    <label class="filter-label">Level</label>
    <fieldset class="filter-levels">
        <div class="checkbox-label">
            <input id="filter-level-1-checkbox"
                   type="checkbox"
                   :value="vocabLevels.LEVEL_1"
                   v-model="levels">
            <label for="filter-level-1-checkbox">Level 1</label>
        </div>
        <div class="checkbox-label">
            <input id="filter-level-2-checkbox"
                   type="checkbox"
                   :value="vocabLevels.LEVEL_2"
                   v-model="levels">
            <label for="filter-level-2-checkbox">Level 2</label>
        </div>
        <div class="checkbox-label">
            <input id="filter-level-3-checkbox"
                   type="checkbox"
                   :value="vocabLevels.LEVEL_3"
                   v-model="levels">
            <label for="filter-level-3-checkbox">Level 3</label>
        </div>
        <div class="checkbox-label">
            <input id="filter-level-4-checkbox"
                   type="checkbox"
                   :value="vocabLevels.LEVEL_4"
                   v-model="levels">
            <label for="filter-level-4-checkbox">Level 4</label>
        </div>

        <div class="checkbox-label">
            <input id="filter-level-learned-checkbox"
                   type="checkbox"
                   :value="vocabLevels.LEARNED"
                   v-model="levels">
            <label for="filter-level-learned-checkbox">Learned</label>
        </div>
    </fieldset>
</template>

<script>
    import {VOCAB_LEVELS} from "@/constants";

    export default {
        name: "VocabFilters",
        emits: ['update:modelValue'],
        props: {
            modelValue: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                levels: this.modelValue.levels,
            };
        },
        watch: {
            $data: {
                handler: function (newVal) {
                    this.$emit("update:modelValue", newVal);
                },
                deep: true,
            }
        },
        computed: {
            vocabLevels() {
                return VOCAB_LEVELS;
            },
            initialSearchQuery() {
                return this.$route.query.searchQuery;
            }
        },
    }
</script>

<style scoped>
    .filter-label {
        font-weight: bold;
    }

    .filter-levels {
        display: flex;
        flex-direction: row;
        column-gap: 1rem;
    }
</style>