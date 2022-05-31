<template>
    <div class="new-word-panel">
        <meaning-adding-controls
                :word-text="word.text"
                :suggested-meanings="suggestedMeanings"
                @onMeaningAdded="onMeaningAdded">

        </meaning-adding-controls>

        <dictionaries-list
                :word-text="word.text">

        </dictionaries-list>
        <div class="mark-buttons-div" v-if="isLevelNew || isLevelIgnored">
            <button class="button-hollow know-button" @click="markWordAsKnown">Mark as
                known
            </button>
            <button class="button-hollow ignore-button" @click="markWordAsIgnored">Ignore
            </button>
        </div>
    </div>
</template>

<script>
    import {WORD_LEVELS} from "@/constants.js";
    import MeaningAddingControls from "@/components/reader/MeaningAddingControls";
    import DictionariesList from "@/components/reader/DictionaryList";
    import {postWord} from "@/components/reader/shared";

    export default {
        name: "NewWordPanel",
        components: {DictionariesList, MeaningAddingControls},
        emits: ["onMeaningAdded", "onWordLevelSet"],
        props: {
            word: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {};
        },
        computed: {
            suggestedMeanings() {
                //TODO add button to show all meanings
                return this.word.all_meanings.filter((meaning) => !this.word.user_meanings.some((m) => m.id === meaning.id)).slice(0, 3);
            },
            isLevelNew() {
                return this.word.level === WORD_LEVELS.NEW;
            },
            isLevelIgnored() {
                return this.word.level === WORD_LEVELS.IGNORED;
            }
        },
        methods: {
            markWordAsKnown() {
                this.postWord(this.word.text, WORD_LEVELS.KNOWN);
                this.$emit('onWordLevelSet', WORD_LEVELS.KNOWN);
            },
            markWordAsIgnored() {
                this.postWord(this.word.text, WORD_LEVELS.IGNORED);
                this.$emit('onWordLevelSet', WORD_LEVELS.IGNORED);
            },
            onMeaningAdded(word, meaning) {
                this.$emit('onMeaningAdded', word, meaning);
            },
            postWord
        }
    }
</script>

<style scoped>
    .new-word-panel {
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
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
</style>