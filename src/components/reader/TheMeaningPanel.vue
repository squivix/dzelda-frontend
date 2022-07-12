<template>
    <div v-if="vocab">
        <h4 class="vocab-text">{{ vocab.text }}</h4>
        <div :class="{'new-vocab-panel':showAddPanel, 'existing-vocab-panel':!showAddPanel}">
            <div v-if="vocab">
                <new-vocab-panel
                        v-if="showAddPanel"
                        :vocab="vocab"
                        :is-phrase="isPhrase"
                        @onMeaningAdded="onMeaningAdded"
                        @onVocabLevelSet="onVocabLevelSet">

                </new-vocab-panel>
                <existing-vocab-panel
                        v-else
                        :vocab="vocab"
                        @onAddMoreMeaningsClicked="onAddMoreMeaningsClicked"
                        @onMeaningDeleted="onMeaningDeleted"
                        @onVocabLevelSet="onVocabLevelSet">
                </existing-vocab-panel>
            </div>
        </div>
    </div>
</template>

<script>
    import {VOCAB_LEVELS} from "@/constants.js";
    import NewVocabPanel from "@/components/reader/NewVocabPanel";
    import ExistingVocabPanel from "@/components/reader/ExistingVocabPanel";

    export default {
        name: "TheMeaningPanel",
        components: {NewVocabPanel, ExistingVocabPanel},
        emits: ['onMeaningAdded', 'onVocabLevelSet', 'onMeaningDeleted'],
        props: {
            vocab: {
                type: Object,
                required: false,
            },
            isPhrase: {
                type: Boolean,
                required: false,
                default: false,
            }
        },
        watch: {
            vocab() {
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
            vocabLevels() {
                return VOCAB_LEVELS;
            },
            isVocabNotSaved() {
                return this.vocab.level === VOCAB_LEVELS.NEW || this.vocab.level === VOCAB_LEVELS.IGNORED || this.vocab.level === VOCAB_LEVELS.KNOWN;
            },
            showAddPanel() {
                return this.isVocabNotSaved || this.addingMoreMeanings;
            }
        },
        methods: {
            onAddMoreMeaningsClicked() {
                this.addingMoreMeanings = true;
            },
            onMeaningAdded(vocab, meaning) {
                this.$emit('onMeaningAdded', vocab, meaning);
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

    .vocab-text {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .new-vocab-panel {
        background-color: #f0f9fe;
        height: 100%;
        padding: 1vw;
        border-radius: 10px;
    }

    .existing-vocab-panel {
        background-color: #FFFCE9;
        height: 100%;
        padding: 1vw;
        border-radius: 10px;
    }
</style>