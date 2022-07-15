<template>
    <base-card title="My Vocabulary" class="library-base-card">
        <template v-slot:content>
            <section class="main-content">
                <div class="bar-table-wrapper">
                    <form class="top-bar">
                        <input type="text" class="search-input" placeholder="Search">
                        <button type="button" class="search-button">
                            <font-awesome-icon icon="magnifying-glass"></font-awesome-icon>
                        </button>
                        <button type="button" class="filter-button">
                            <font-awesome-icon icon="filter"></font-awesome-icon>
                        </button>
                    </form>

                    <table class="vocab-table">
                        <thead class="vocab-thead">
                        <tr>
                            <th>Vocab</th>
                            <th>Meanings</th>
                            <th>Level</th>
                        </tr>
                        </thead>
                        <tbody class="vocab-rows">
                        <tr v-for="vocab in vocabs" :key="vocab.id">
                            <td @click.stop="setSelectedVocab(vocab)" class="link-parent">
                                <button class="inv-button link">
                                    {{vocab.text}}
                                </button>
                            </td>
                            <td>
                                <ul v-for="meaning in vocab.user_meanings" :key="meaning.id">{{meaning.text}}</ul>
                            </td>
                            <td>
                                <vocab-level-display :level="vocab.level"></vocab-level-display>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="meaning-panel-wrapper">
                    <the-meaning-panel
                            :vocab="selectedVocab"
                            @onMeaningAdded="onMeaningAdded"
                            @onVocabLevelSet="onVocabLevelSet"
                            @onMeaningDeleted="onMeaningDeleted"
                            :class="{'meaning-panel':!!selectedVocab}">
                        <template v-slot:no-selected-panel>
                            <h4>Select a word or phrase</h4>
                        </template>
                    </the-meaning-panel>
                </div>
            </section>
        </template>
    </base-card>
</template>

<script>
    import TheMeaningPanel from "@/components/reader/TheMeaningPanel";
    import VocabLevelDisplay from "@/components/reader/VocabLevelDisplay";
    import {VOCAB_LEVELS} from "@/constants";

    export default {
        name: "MyVocabPage",
        components: {VocabLevelDisplay, TheMeaningPanel},
        data() {
            return {
                vocabs: null,
                selectedVocab: null,
            };
        },
        async mounted() {
            this.vocabs = await this.fetchVocabs();
        },
        methods: {
            async fetchVocabs() {
                return await this.$store.dispatch("fetchUserVocabs", {language: this.$route.params.learningLanguage});
            },
            setSelectedVocab(vocab) {
                this.selectedVocab = vocab;
            },
            clearSelectedVocab() {
                this.selectedVocab = null;
            },
            onMeaningAdded(vocab, meaning) {
                vocab.user_meanings.push(meaning)
            },
            onVocabLevelSet(vocab, level) {
                if (level === VOCAB_LEVELS.IGNORED) {
                    this.vocabs.splice(this.vocabs.findIndex((v) => v.text === vocab.text), 1)
                    this.clearSelectedVocab();
                } else
                    vocab.level = level;
            },
            onMeaningDeleted(vocab, meaning) {
                const index = vocab.user_meanings.findIndex((v) => v.text === meaning.text);
                if (index !== -1)
                    vocab.user_meanings.splice(index, 1);
            },
        }
    }
</script>


<style scoped>

    .library-base-card {
        margin-left: 2vw;
        margin-right: 2vw;
        margin-bottom: 5vh;
    }

    .main-content {
        display: flex;
        flex-direction: row;
        column-gap: 1rem;
        height: 100vh;
    }

    .bar-table-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        flex-grow: 3;
        overflow: auto;
        padding-right: 0.5rem;
    }

    .vocab-table {

    }

    .top-bar {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: stretch;
        margin-bottom: 1rem;
        column-gap: 0.5vw;
    }

    .search-input {
        flex-grow: 2;
    }

    .search-button {
        flex-basis: 30px;
        border-radius: 50%;
        background-color: var(--primary-color);
        border: 1px solid var(--on-primary-color);
    }

    .search-button svg {
        color: var(--on-primary-color);
    }

    .filter-button {
        border: 2px solid gray;
        border-radius: 5px;
    }

    .meaning-panel-wrapper {
        flex-grow: 1;
        flex-basis: 500px;
        max-width: 400px;
        align-self: flex-start;
    }

    .meaning-panel {
        border: 1px solid lightgray;
        padding: 0.5rem;
        border-radius: 5px;
        /*position: fixed;*/
    }

    .vocab-thead {
        border-bottom: 1px solid lightgray;
    }

    .vocab-thead th {
        padding-bottom: 0.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
        text-align: start;
    }

    .vocab-thead th:not(.centered-table-col) {
        text-align: start;
        vertical-align: middle;
        font-weight: bold;
    }

    .vocab-rows tr:nth-child(odd) {
        background-color: whitesmoke;
    }

    .vocab-rows td {
        padding: 1rem 1rem;
    }

    .vocab-rows td button {
        font-size: 1rem;
    }
</style>