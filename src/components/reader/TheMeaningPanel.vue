<template>
    <div v-if="word">
        <h4 class="word-text">{{ word.text }}</h4>
        <div class="meanings">
            <ol class="user-meanings">
                <li v-for="meaning in userMeanings" :key="meaning.id">
                    <input :value="meaning.text"/>
                </li>
            </ol>

            <ol class="new-meanings">
                <li
                        v-for="meaning in newMeaningsPreview"
                        :key="meaning"
                        @click="saveMeaning(meaning)"
                >
                    {{ meaning.text }}
                </li>
            </ol>

            <input placeholder="Manually add meaning here"/>

            <ol class="levels" v-if="level !== wordLevels.NEW && level !== wordLevels.IGNORED">
                <li :class="{ highlighted: level === wordLevels.LEVEL_1 }" @click="setLevel(wordLevels.LEVEL_1)">
                    {{wordLevels.LEVEL_1}}
                </li>
                <li :class="{ highlighted: level === wordLevels.LEVEL_2 }" @click="setLevel(wordLevels.LEVEL_2)">
                    {{wordLevels.LEVEL_2}}
                </li>
                <li :class="{ highlighted: level === wordLevels.LEVEL_3 }" @click="setLevel(wordLevels.LEVEL_3)">
                    {{wordLevels.LEVEL_3}}
                </li>
                <li :class="{ highlighted: level === wordLevels.LEVEL_4 }" @click="setLevel(wordLevels.LEVEL_4)">
                    {{wordLevels.LEVEL_4}}
                </li>
                <li :class="{ highlighted: level === wordLevels.LEARNED }" @click="setLevel(wordLevels.LEARNED)">
                    <font-awesome-icon icon="check" ref="toggleShowIcon"/>
                </li>
                <li :class="{ highlighted: level === wordLevels.IGNORED }" @click="setLevel(wordLevels.IGNORED)">
                    <font-awesome-icon icon="ban" ref="toggleShowIcon"/>
                </li>
            </ol>

            <ul>
                <li>Dictionary 1</li>
            </ul>

            <button v-if="level===wordLevels.NEW" class="button-hollow ignore-button" @click="ignoreWord">Ignore
            </button>
        </div>
    </div>
</template>

<script>
    import {WORD_LEVELS} from "@/constants.js";

    export default {
        emits: ['onNewMeaningSelected', 'onWordLevelSet'],
        watch: {
            word(new_value) {
                if (new_value) {
                    this.fetchMeanings();
                }
            },
        },
        computed: {
            level() {
                return this.word.level;
            },
            userMeanings() {
                return this.word.user_meanings;
            },
            newMeaningsPreview() {
                return this.word.meanings
                    .filter((meaning) => {
                        return !this.userMeanings.some((m) => m.id === meaning.id);
                    })
                    .slice(0, 3);
            },
            wordLevels() {
                return WORD_LEVELS;
            }
        },
        props: {
            word: {
                type: Object,
                required: false,
            },
        },
        methods: {
            fetchMeanings() {
            },
            saveMeaning(meaning) {
                this.postNewWord().then((new_word) =>
                    this.postMeaning(new_word.id, meaning)
                );
                this.$emit('onNewMeaningSelected', this.word, meaning);
            },

            async postMeaning(word_id, meaning) {
                return await this.$store.dispatch("postNewMeaning", {
                    word_id: word_id,
                    meaningLanguage: this.$route.params.learningLanguage,
                    meaningText: meaning.text
                });
            },
            async postNewWord(level) {
                return await this.$store.dispatch("postNewWord", {
                    language: this.$route.params.learningLanguage,
                    text: this.word.text,
                    level: level
                });
            },
            async setLevel(level) {
                await this.$store.dispatch("updateWordLevel", {
                    word_id: this.word.id,
                    language: this.$route.params.learningLanguage,
                    level: level
                });
                this.$emit('onWordLevelSet', this.word, level);
            },
            ignoreWord() {
                this.postNewWord(WORD_LEVELS.IGNORED);
                this.$emit('onWordLevelSet', this.word, WORD_LEVELS.IGNORED);
            }
        },
    };
</script>

<style scoped>
    .meaning-panel {
        background-color: #f0f9fe;
        border-radius: 10px;
        padding: 1vw;
    }

    .word-text {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .meanings {
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
    }

    .user-meanings {
        display: flex;
        flex-direction: column;
        row-gap: 0.5rem;
    }

    .user-meanings input {
        width: 100%;
    }

    .new-meanings {
        display: flex;
        flex-direction: column;
        row-gap: 0.25rem;
    }

    .new-meanings > li {
        background-color: var(--primary-color);
        padding: 15px 10px;
        cursor: pointer;
        font-size: 1.15rem;
        color: var(--on-primary-color);
        border-radius: 5px;
        width: 100%;
    }

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

    .ignore-button {
        color: gray;
    }
</style>