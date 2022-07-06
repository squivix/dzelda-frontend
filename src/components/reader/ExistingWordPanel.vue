<template>
    <div class="existing-word-panel">
        <meaning-editing-controls
                @onMeaningDeleted="onMeaningDeleted"
                :wordId="word.id"
                :saved-meanings="word.user_meanings"
        >
        </meaning-editing-controls>

        <button class="button-hollow add-meaning-button" @click="addMeaning">
            <font-awesome-icon icon="plus"></font-awesome-icon>
        </button>

        <h5>Set Level</h5>
        <word-level-picker
                :wordId="word.id"
                :level="word.level"
                @onWordLevelSet="onWordLevelSet">
        </word-level-picker>

        <textarea class="notes"
                  placeholder="Notes"></textarea>
        <!--        TODO: Encounters with word button-->
        <!--        <button>View Encounters with this word</button>-->
    </div>
</template>

<script>
    import WordLevelPicker from "@/components/reader/WordLevelPicker";
    import MeaningEditingControls from "@/components/reader/MeaningEditingControls";

    export default {
        name: "ExistingWordPanel",
        components: {MeaningEditingControls, WordLevelPicker},
        emits: ["onAddMoreMeaningsClicked", "onMeaningDeleted", "onWordLevelSet"],
        props: {
            word: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {};
        },
        computed: {},

        methods: {
            addMeaning() {
                this.$emit("onAddMoreMeaningsClicked");
            },
            onMeaningDeleted(meaning) {
                this.$emit("onMeaningDeleted", meaning);
            },
            onWordLevelSet(level) {
                this.$emit("onWordLevelSet", level);
            }
        },

    }
</script>

<style scoped>
    .existing-word-panel {
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
    }

    .notes {
        resize: none;
        overflow: auto;
        height: 150px;
    }

    .add-meaning-button {
        padding-top: 0.3rem;
        padding-bottom: 0.3rem;
        background-color: #FFD263;
        border: 1px solid #FFD263;
    }

    .add-meaning-button svg {
        color: black;
    }
</style>