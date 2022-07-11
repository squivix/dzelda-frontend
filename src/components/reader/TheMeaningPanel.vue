<template>
    <div v-if="vocab">
        <h4 class="word-text">{{ vocab.text }}</h4>
        <div :class="{'new-word-panel':showAddPanel, 'existing-word-panel':!showAddPanel}">
            <div v-if="vocab">
                <new-word-panel
                        v-if="showAddPanel"
                        :word="vocab"
                        @onMeaningAdded="onMeaningAdded"
                        @onVocabLevelSet="onVocabLevelSet">

                </new-word-panel>
                <existing-word-panel
                        v-else
                        :word="vocab"
                        @onAddMoreMeaningsClicked="onAddMoreMeaningsClicked"
                        @onMeaningDeleted="onMeaningDeleted"
                        @onVocabLevelSet="onVocabLevelSet">
                </existing-word-panel>
            </div>
        </div>
    </div>
</template>

<script>
    import {WORD_LEVELS} from "@/constants.js";
    import NewWordPanel from "@/components/reader/NewWordPanel";
    import ExistingWordPanel from "@/components/reader/ExistingWordPanel";

    export default {
        name: "TheMeaningPanel",
        components: {NewWordPanel, ExistingWordPanel},
        emits: ['onMeaningAdded', 'onVocabLevelSet', 'onMeaningDeleted'],
        props: {
            vocab: {
                type: Object,
                required: false,
            }
        },
        watch: {
            word() {
                if (this.vocab === null)
                    this.addingMoreMeanings = false;
            }
        },
        data() {
            return {
                addingMoreMeanings: false
            };
        },
        computed: {
            wordLevels() {
                return WORD_LEVELS;
            },
            isWordNotSaved() {
                return this.vocab.level === WORD_LEVELS.NEW || this.vocab.level === WORD_LEVELS.IGNORED || this.vocab.level === WORD_LEVELS.KNOWN;
            },
            showAddPanel() {
                return this.isWordNotSaved || this.addingMoreMeanings;
            }
        },
        methods: {
            onAddMoreMeaningsClicked() {
                this.addingMoreMeanings = true;
            },
            onMeaningAdded(word, meaning) {
                this.$emit('onMeaningAdded', word, meaning);
                this.addingMoreMeanings = false;
            },
            onMeaningDeleted(meaning) {
                this.$emit("onMeaningDeleted", this.vocab, meaning);
            },
            onVocabLevelSet(level) {
                this.$emit("onVocabLevelSet", this.vocab, level);
            }
        },
    };
</script>

<style scoped>

    .meaning-panel {
    }

    .word-text {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .new-word-panel {
        background-color: #f0f9fe;
        height: 100%;
        padding: 1vw;
        border-radius: 10px;
    }

    .existing-word-panel {
        background-color: #FFFCE9;
        height: 100%;
        padding: 1vw;
        border-radius: 10px;
    }
</style>