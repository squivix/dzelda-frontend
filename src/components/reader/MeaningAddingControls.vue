<template>
    <div class="suggested-meanings-div" v-if="suggestedMeanings.length>0">
        <h5>Suggested Meanings</h5>
        <ol class="suggested-meanings">
            <li v-for="meaning in suggestedMeanings"
                :key="meaning"
                @click="addSuggestedMeaning(meaning)">
                {{ meaning.text }}
            </li>
        </ol>
    </div>

    <form class="new-meaning-form" action="javascript:void(0);">
        <input placeholder="Add new meaning here" v-model="newMeaning"/>
        <button class="new-meaning-button"
                @click="addNewMeaning"
                type="submit">
            <font-awesome-icon icon="plus"/>
        </button>
    </form>
</template>

<script>
    import {postWord} from "@/components/reader/shared";

    export default {
        name: "MeaningAddingControls",
        components: {},
        emits: ["onMeaningAdded"],
        props: {
            wordText: {
                type: String,
                required: true,
            },
            suggestedMeanings: {
                type: Array,
                required: true,
            }
        },
        data() {
            return {
                newMeaning: null,
            };
        },
        methods: {
            addSuggestedMeaning(meaning) {
                this.postWord(this.wordText).then((new_word) => {
                        this.$store.dispatch("saveMeaningToUser", {
                            word_id: new_word.id,
                            meaningLanguage: this.$route.params.learningLanguage,
                            meaningText: meaning.text
                        });
                        this.$emit('onMeaningAdded', new_word, meaning);
                    }
                );
            },
            addNewMeaning() {
                if (this.newMeaning === undefined || this.newMeaning === "")
                    return;
                this.postWord(this.wordText).then(async (new_word) => {
                    const meaning = await this.$store.dispatch("addNewMeaning", {
                        word_id: new_word.id,
                        meaningLanguage: "en",
                        meaningText: this.newMeaning,
                    });
                    this.$emit('onMeaningAdded', new_word, meaning);
                    this.newMeaning = "";
                });
            },
            postWord
        }
    }
</script>

<style scoped>
    .suggested-meanings-div {
        display: flex;
        flex-direction: column;
        row-gap: 0.5rem;
    }

    .suggested-meanings {
        display: flex;
        flex-direction: column;
        row-gap: 0.25rem;
    }

    .suggested-meanings > li {
        background-color: var(--primary-color);
        padding: 15px 10px;
        cursor: pointer;
        font-size: 1.15rem;
        color: var(--on-primary-color);
        border-radius: 5px;
        width: 100%;
    }

    .new-meaning-form {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: stretch;
        align-items: center;
        column-gap: 5px;
    }

    .new-meaning-form > input {
        flex-grow: 1;
    }

    .new-meaning-button {
        width: 40px;
        height: 40px;
        background-color: #FFD263;
        border: 1px solid #FFD263;
        color: black;
        border-radius: 50%;
    }

    .new-meaning-button:hover {
        cursor: pointer;
    }
</style>