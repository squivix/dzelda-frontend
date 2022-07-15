<template>
    <div class="new-vocab-panel">
        <meaning-adding-controls
                :vocab-text="vocab.text"
                :suggested-meanings="suggestedMeanings"
                @onMeaningAdded="onMeaningAdded">

        </meaning-adding-controls>

        <dictionaries-list
                :vocab-text="vocab.text">
        </dictionaries-list>
        <div class="mark-buttons-div" v-if="!isPhrase && isLevelNew || isLevelIgnored">
            <button class="button-hollow know-button" @click="markWordAsKnown">Mark as
                known
            </button>
            <button class="button-hollow ignore-button" @click="markWordAsIgnored">Ignore
            </button>
        </div>
    </div>
</template>

<script>
    import {VOCAB_LEVELS} from "@/constants.js";
    import MeaningAddingControls from "@/components/reader/MeaningAddingControls";
    import DictionariesList from "@/components/reader/DictionaryList";
    import {postVocab} from "@/components/reader/shared";

    export default {
        name: "NewVocabPanel",
        components: {MeaningAddingControls, DictionariesList},
        emits: ["onMeaningAdded", "onVocabLevelSet"],
        props: {
            vocab: {
                type: Object,
                required: true,
            },
            isPhrase: {
                type: Boolean,
                required: true,
            }
        },
        data() {
            return {};
        },
        computed: {
            suggestedMeanings() {
                //TODO add button to show all meanings
                return this.vocab.all_meanings.filter((meaning) => !this.vocab.user_meanings.some((m) => m.id === meaning.id)).slice(0, 3);
            },
            isLevelNew() {
                return this.vocab.level === VOCAB_LEVELS.NEW;
            },
            isLevelIgnored() {
                return this.vocab.level === VOCAB_LEVELS.IGNORED;
            }
        },
        methods: {
            markWordAsKnown() {
                this.postVocab(this.vocab.text, VOCAB_LEVELS.KNOWN);
                this.$emit('onVocabLevelSet', VOCAB_LEVELS.KNOWN);
            },
            markWordAsIgnored() {
                this.postVocab(this.vocab.text, VOCAB_LEVELS.IGNORED);
                this.$emit('onVocabLevelSet', VOCAB_LEVELS.IGNORED);
            },
            onMeaningAdded(vocab, meaning) {
                this.$emit('onMeaningAdded', vocab, meaning);
            },
            postVocab
        }
    }
</script>

<style scoped>
    .new-vocab-panel {
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