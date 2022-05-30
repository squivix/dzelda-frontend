<template>
    <div v-if="word">
        <h4 class="word-text">{{ word.text }}</h4>
        <div :class="{'new-word-panel':showAddPanel, 'existing-word-panel':!showAddPanel}">
            <div v-if="word">
                <new-word-panel
                        v-if="showAddPanel"
                        :word="word"
                        @onMeaningAdded="onMeaningAdded"
                        @onWordLevelSet="onWordLevelSet"
                >

                </new-word-panel>
                <existing-word-panel
                        v-else
                        :word="word"
                        @onAddMoreMeaningsClicked="onAddMoreMeaningsClicked"
                        @onMeaningDeleted="onMeaningDeleted"
                        @onWordLevelSet="onWordLevelSet">
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
        components: {NewWordPanel, ExistingWordPanel},
        emits: ['onMeaningAdded', 'onWordLevelSet', 'onMeaningDeleted'],
        props: {
            word: {
                type: Object,
                required: false,
            },
        },
        watch: {
            word() {
                if (this.word === null)
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
                return this.word.level === WORD_LEVELS.NEW || this.word.level === WORD_LEVELS.IGNORED || this.word.level === WORD_LEVELS.KNOWN;
            },
            showAddPanel() {
                return this.isWordNotSaved || this.addingMoreMeanings;
            }
        },
        methods: {
            onAddMoreMeaningsClicked() {
                this.addingMoreMeanings = true;
            },
            onMeaningAdded(meaning) {
                this.$emit('onMeaningAdded', this.word, meaning);
                this.addingMoreMeanings = false;
            },
            onMeaningDeleted(meaning) {
                this.$emit("onMeaningDeleted", this.word, meaning);
            },
            onWordLevelSet(level) {
                this.$emit("onWordLevelSet", this.word, level);
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