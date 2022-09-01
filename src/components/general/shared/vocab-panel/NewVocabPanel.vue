<template>
    <div class="new-vocab-panel">

        <meaning-adding-controls
                :vocab-id="vocab.id"
                :vocab-text="vocab.text"
                :is-phrase="isPhrase"
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
import {ALL_VOCAB_LEVELS} from "@/constants.js";
import MeaningAddingControls from "@/components/general/shared/vocab-panel/MeaningAddingControls.vue";
import DictionariesList from "@/components/general/shared/vocab-panel/DictionaryList.vue";
import {postUserVocab} from "@/components/page/reader/shared.js";
import {useVocabStore} from "@/stores/vocab";

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
                return this.vocab.allMeanings.filter((meaning) => !this.vocab.userMeanings.some((m) => m.id === meaning.id)).slice(0, 3);
            },
            isLevelNew() {
                return this.vocab.level === ALL_VOCAB_LEVELS.NEW;
            },
            isLevelIgnored() {
                return this.vocab.level === ALL_VOCAB_LEVELS.IGNORED;
            }
        },
        methods: {
            async markWordAsKnown() {
                await this.postUserVocab(this.vocab.id);
                await this.vocabStore.updateVocabLevel({
                    vocabId: this.vocab.id,
                    level: ALL_VOCAB_LEVELS.KNOWN
                })
                this.$emit('onVocabLevelSet', ALL_VOCAB_LEVELS.KNOWN);
            },
            async markWordAsIgnored() {
                await this.postUserVocab(this.vocab.id);
                await this.vocabStore.updateVocabLevel({
                    vocabId: this.vocab.id,
                    level: ALL_VOCAB_LEVELS.IGNORED
                })
                this.$emit('onVocabLevelSet', ALL_VOCAB_LEVELS.IGNORED);
            },
            onMeaningAdded(vocab, meaning) {
                this.$emit('onMeaningAdded', vocab, meaning);
            },
            postUserVocab
        },
        created() {
            this.vocabStore = useVocabStore();
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