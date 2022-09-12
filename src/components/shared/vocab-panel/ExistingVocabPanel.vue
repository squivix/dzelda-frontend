<template>
    <div class="existing-vocab-panel">
        <meaning-editing-controls
                @onMeaningDeleted="onMeaningDeleted"
                :vocab-id="vocab.id"
                :saved-meanings="vocab.userMeanings"
        >
        </meaning-editing-controls>

        <button class="button-hollow add-meaning-button" @click="addMeaning">
            <font-awesome-icon icon="plus"></font-awesome-icon>
        </button>

        <h5>Set Level</h5>
        <vocab-level-picker
                :vocab-id="vocab.id"
                :level="vocab.level"
                @onVocabLevelSet="onVocabLevelSet">
        </vocab-level-picker>

        <textarea class="notes"
                  placeholder="Notes"></textarea>
        <!--        TODO: Encounters with vocab button-->
        <!--        <button>View Encounters with this vocab</button>-->
    </div>
</template>

<script>
import VocabLevelPicker from "@/components/shared/vocab-panel/VocabLevelPicker.vue";
import MeaningEditingControls from "@/components/shared/vocab-panel/MeaningEditingControls.vue";

export default {
        name: "ExistingVocabPanel",
        components: {MeaningEditingControls, VocabLevelPicker},
        emits: ["onAddMoreMeaningsClicked", "onMeaningDeleted", "onVocabLevelSet"],
        props: {
            vocab: {
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
            onVocabLevelSet(level) {
                this.$emit("onVocabLevelSet", level);
            }
        },

    }
</script>

<style scoped>
    .existing-vocab-panel {
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