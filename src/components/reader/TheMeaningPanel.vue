<template>
    <div v-if="word">
        <h4 class="word-text">{{ word.text }}</h4>
        <div class="meanings">
            <ol class="user-meanings">
                <li v-for="meaning in userMeanings" :key="meaning.id">
                    <form action="javascript:void(0);">
                        <button class="delete-user-meaning-button" @click="deleteUserMeaning(meaning)" type="button">
                            <font-awesome-icon icon="x" ref="toggleShowIcon" class="fa-xs"/>
                        </button>
                        <input :value="meaning.text" :ref="`user-meaning-input-${meaning.id}`"/>
                        <button class="edit-user-meaning-button" @click="editUserMeaning(meaning)" type="submit">
                            <font-awesome-icon icon="check" ref="toggleShowIcon" class="fa-xs"/>
                        </button>
                    </form>
                </li>
            </ol>

            <ol class="new-meanings">
                <li
                        v-for="meaning in newMeaningsPreview"
                        :key="meaning"
                        @click="onMeaningClicked(meaning)"
                >
                    {{ meaning.text }}
                </li>
            </ol>

            <form class="manual-meaning-form" action="javascript:void(0);">
                <input placeholder="Manually add meaning here" v-model="manualMeaning"/>
                <button class="add-meaning-button"
                        @click="addManualMeaning"
                        type="submit">
                    <font-awesome-icon icon="plus"/>
                </button>
            </form>
            <ol class="levels"
                v-if="level !== wordLevels.NEW && level !== wordLevels.IGNORED&& level !== wordLevels.KNOWN">
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
            <div class="mark-buttons-div">
                <button v-if="level===wordLevels.NEW" class="button-hollow know-button" @click="markWordAsKnown">Mark as
                    known
                </button>
                <button v-if="level===wordLevels.NEW" class="button-hollow ignore-button" @click="ignoreWord">Ignore
                </button>
            </div>

        </div>
    </div>
</template>

<script>
    import {WORD_LEVELS} from "@/constants.js";

    export default {
        emits: ['onNewMeaningSelected', 'onWordLevelSet', 'onUserMeaningDeleted'],

        data() {
            return {
                manualMeaning: "",
            };
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
            onMeaningClicked(meaning) {
                this.postNewWord().then((new_word) =>
                    this.saveMeaning(new_word.id, meaning)
                );
                this.$emit('onNewMeaningSelected', this.word, meaning, true);
            },

            async saveMeaning(word_id, meaning) {
                return await this.$store.dispatch("saveMeaningToUser", {
                    word_id: word_id,
                    meaningLanguage: this.$route.params.learningLanguage,
                    meaningText: meaning.text
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
            },
            markWordAsKnown() {
                this.postNewWord(WORD_LEVELS.KNOWN);
                this.$emit('onWordLevelSet', this.word, WORD_LEVELS.KNOWN);
            },

            addManualMeaning() {
                if (this.manualMeaning === undefined || this.manualMeaning === "")
                    return;
                this.postNewWord().then(async (new_word) => {
                    const meaning = await this.$store.dispatch("addNewMeaning", {
                        word_id: new_word.id,
                        meaningLanguage: "en",
                        meaningText: this.manualMeaning,
                    });
                    this.$emit('onNewMeaningSelected', this.word, meaning, false);
                    this.manualMeaning = "";

                });
            },
            async postNewWord(level) {
                return await this.$store.dispatch("postNewWord", {
                    language: this.$route.params.learningLanguage,
                    text: this.word.text,
                    level: level
                });
            },
            async deleteUserMeaning(meaning) {
                await this.$store.dispatch("deleteUserMeaning", {
                    word_id: this.word.id,
                    meaning_id: meaning.id
                });
                this.$emit('onUserMeaningDeleted', this.word, meaning);
            },
            async editUserMeaning(meaning) {
                const edited_meaning = this.$refs[`user-meaning-input-${meaning.id}`][0].value.trim();
                if (edited_meaning === undefined || edited_meaning === "")
                    await this.deleteUserMeaning(meaning)
                else if (edited_meaning === meaning.text)
                    return;
                this.$store.dispatch("deleteUserMeaning", {
                    word_id: this.word.id,
                    meaning_id: meaning.id
                }).then(() => {
                    this.$store.dispatch("addNewMeaning", {
                        word_id: this.word.id,
                        meaningLanguage: "en",
                        meaningText: edited_meaning,
                    });
                });

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

    .user-meanings > li > form {
        display: flex;
        flex-direction: row;
        column-gap: 5px;
        justify-content: stretch;
        align-items: center;
    }

    .user-meanings input {
        width: 100%;
        flex-grow: 1;
    }

    .delete-user-meaning-button {
        min-width: 20px;
        height: 20px;
        padding: 0;
        background-color: white;
        color: black;
        border: 1px solid gray;
        border-radius: 50%;
    }

    .delete-user-meaning-button:hover {
        cursor: pointer;
    }

    .edit-user-meaning-button {
        min-width: 30px;
        height: 30px;
        padding: 0;
        background-color: #FFD263;
        color: black;
        border: 1px solid #FFD263;
        border-radius: 50%;
    }

    .edit-user-meaning-button:hover {
        cursor: pointer;
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

    .mark-buttons-div {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .ignore-button {
        color: gray;
        border: none;
        flex-grow: 1;
    }

    .know-button {
        color: var(--primary-color);
        border: none;
        flex-grow: 1;
    }

    .manual-meaning-form {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: stretch;
        align-items: center;
        column-gap: 5px;
    }

    .manual-meaning-form > input {
        flex-grow: 1;
    }

    .add-meaning-button {
        width: 40px;
        height: 40px;
        background-color: #FFD263;
        border: 1px solid #FFD263;
        color: black;
        border-radius: 50%;
    }

    .add-meaning-button:hover {
        cursor: pointer;
    }
</style>