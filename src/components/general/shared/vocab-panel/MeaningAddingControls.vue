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
    import {postUserVocab} from "@/components/page/reader/shared";
    import {useMeaningStore} from "@/stores/meaning";
    import {useVocabStore} from "@/stores/vocab";

    export default {
        name: "MeaningAddingControls",
        components: {},
        emits: ["onMeaningAdded"],
        props: {
            vocabId: {
                type: Number,
                required: false,
            },
            vocabText: {
                type: String,
                required: true,
            },
            isPhrase: {
                type: Boolean,
                required: false,
                default: false,
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
                this.postUserVocab(this.vocabId).then(async newVocab => {
                    await this.meaningStore.addMeaningToUser({meaningId: meaning.id});
                    this.$emit('onMeaningAdded', newVocab, meaning);
                });
            },
            async addNewMeaning() {
                if (this.newMeaning === undefined || this.newMeaning === "")
                    return;
                let vocabId = this.vocabId;
                if (this.isPhrase && !this.vocabId) {
                    vocabId = (await this.vocabStore.createVocab({
                        text: this.vocabText,
                        languageCode: this.$route.params.learningLanguage,
                        isPhrase: true,
                    })).id;
                }

                this.postUserVocab(vocabId).then(async (newVocab) => {
                    this.meaningStore.createMeaning({
                        text: this.newMeaning,
                        vocabId: newVocab.id,
                        //TODO: no language hard-coding
                        languageCode: "en",
                    }).then(async newMeaning => {
                        await this.meaningStore.addMeaningToUser({
                            meaningId: newMeaning.id
                        });
                        this.$emit('onMeaningAdded', newVocab, newMeaning);
                        this.newMeaning = "";
                    });
                });
            },
            postUserVocab
        },
        created() {
            this.vocabStore = useVocabStore();
            this.meaningStore = useMeaningStore();
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