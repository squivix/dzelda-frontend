<template>
    <ol class="levels"
        v-if="level !== wordLevels.NEW && level !== wordLevels.IGNORED&& level !== wordLevels.KNOWN">
        <li :class="{ highlighted: level === wordLevels.LEVEL_1 }" @click="setWordLevel(wordLevels.LEVEL_1)">
            {{wordLevels.LEVEL_1}}
        </li>
        <li :class="{ highlighted: level === wordLevels.LEVEL_2 }" @click="setWordLevel(wordLevels.LEVEL_2)">
            {{wordLevels.LEVEL_2}}
        </li>
        <li :class="{ highlighted: level === wordLevels.LEVEL_3 }" @click="setWordLevel(wordLevels.LEVEL_3)">
            {{wordLevels.LEVEL_3}}
        </li>
        <li :class="{ highlighted: level === wordLevels.LEVEL_4 }" @click="setWordLevel(wordLevels.LEVEL_4)">
            {{wordLevels.LEVEL_4}}
        </li>
        <li :class="{ highlighted: level === wordLevels.LEARNED }" @click="setWordLevel(wordLevels.LEARNED)">
            <font-awesome-icon icon="check" ref="toggleShowIcon"/>
        </li>
        <li :class="{ highlighted: level === wordLevels.IGNORED }" @click="setWordLevel(wordLevels.IGNORED)">
            <font-awesome-icon icon="ban" ref="toggleShowIcon"/>
        </li>
    </ol>

</template>

<script>
    import {WORD_LEVELS} from "@/constants";

    export default {
        emits: ["onWordLevelSet"],
        props: {
            wordId: {
                type: Number,
                required: true
            },
            level: {
                type: Number,
                required: true
            }
        },
        computed: {
            wordLevels() {
                return WORD_LEVELS;
            }
        },
        methods: {
            async setWordLevel(level) {
                await this.$store.dispatch("updateWordLevel", {
                    word_id: this.word_id,
                    language: this.$route.params.learningLanguage,
                    level: level
                });
                this.$emit('onWordLevelSet', level);
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