<template>
    <ol class="levels"
        v-if="level !== vocabLevels.NEW && level !== vocabLevels.IGNORED&& level !== vocabLevels.KNOWN">
        <li :class="{ highlighted: level === vocabLevels.LEVEL_1 }" @click.stop="setVocabLevel(vocabLevels.LEVEL_1)">
            {{vocabLevels.LEVEL_1}}
        </li>
        <li :class="{ highlighted: level === vocabLevels.LEVEL_2 }" @click.stop="setVocabLevel(vocabLevels.LEVEL_2)">
            {{vocabLevels.LEVEL_2}}
        </li>
        <li :class="{ highlighted: level === vocabLevels.LEVEL_3 }" @click.stop="setVocabLevel(vocabLevels.LEVEL_3)">
            {{vocabLevels.LEVEL_3}}
        </li>
        <li :class="{ highlighted: level === vocabLevels.LEVEL_4 }" @click.stop="setVocabLevel(vocabLevels.LEVEL_4)">
            {{vocabLevels.LEVEL_4}}
        </li>
        <li :class="{ highlighted: level === vocabLevels.LEARNED }" @click.stop="setVocabLevel(vocabLevels.LEARNED)">
            <font-awesome-icon icon="check" ref="toggleShowIcon"/>
        </li>
        <li :class="{ highlighted: level === vocabLevels.IGNORED }" @click.stop="setVocabLevel(vocabLevels.IGNORED)">
            <font-awesome-icon icon="ban" ref="toggleShowIcon"/>
        </li>
    </ol>

</template>

<script>
    import {ALL_LEVELS} from "@/constants";

    export default {
        name: "VocabLevelPicker",
        components: {},
        emits: ["onVocabLevelSet"],
        props: {
            vocabId: {
                type: Number,
                required: true
            },
            level: {
                type: Number,
                required: true
            }
        },
        computed: {
            vocabLevels() {
                return ALL_LEVELS;
            }
        },
        methods: {
            async setVocabLevel(level) {
                await this.$store.dispatch("updateVocabLevel", {
                    vocabId: this.vocabId,
                    language: this.$route.params.learningLanguage,
                    level: level
                });
                this.$emit('onVocabLevelSet', level);
            },
        },
    }
</script>

<style scoped>
    .levels {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-evenly;
        align-content: stretch;
    }

    .levels > li {
        background-color: #cfe8ed;
        flex-grow: 1;
        border: 1px solid #408adb;
        padding: 10px;
        text-align: center;
        cursor: pointer;
    }

    .levels > li:first-child {
        border-start-start-radius: 20px;
        border-end-start-radius: 20px;
    }

    .levels > li:last-child {
        border-end-end-radius: 20px;
        border-start-end-radius: 20px;
    }

    .levels .highlighted {
        background-color: var(--primary-color);
        color: var(--on-primary-color);
    }
</style>