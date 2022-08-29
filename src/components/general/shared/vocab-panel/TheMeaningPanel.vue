<template>
    <div>
        <div v-if="vocab">
            <h4 class="vocab-text">{{ vocab.text }}</h4>
            <div :class="{'meaning-sub-panel':true,'new-vocab-panel':showAddPanel, 'existing-vocab-panel':!showAddPanel}">
                <div>
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
        <slot name="no-selected-panel" v-else>

        </slot>
    </div>
</template>

<script>
    import {ALL_VOCAB_LEVELS} from "@/constants";
    import NewVocabPanel from "@/components/general/shared/vocab-panel/NewVocabPanel";
    import ExistingVocabPanel from "@/components/general/shared/vocab-panel/ExistingVocabPanel";

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
                return ALL_VOCAB_LEVELS;
            },
            isVocabNotSaved() {
                return this.vocab.level === ALL_VOCAB_LEVELS.NEW || this.vocab.level === ALL_VOCAB_LEVELS.IGNORED || this.vocab.level === ALL_VOCAB_LEVELS.KNOWN;
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

    .meaning-panel-wrapper {
    }

    .vocab-text {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .meaning-sub-panel {
        padding: 1vw;
        border-radius: 10px;
    }

    .new-vocab-panel {
        background-color: #f0f9fe;
    }

    .existing-vocab-panel {
        background-color: #FFFCE9;
    }
</style>