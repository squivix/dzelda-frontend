<template>
    <base-card title="My Vocabulary" class="library-base-card" @click="clearSelectedVocab">
        <template v-slot:content>
            <form class="top-bar">
                <input type="text" class="search-input" placeholder="Search">
                <button type="button" class="search-button">
                    <font-awesome-icon icon="magnifying-glass"></font-awesome-icon>
                </button>
                <button type="button" class="filter-button">
                    <font-awesome-icon icon="filter"></font-awesome-icon>
                </button>
            </form>
            <section class="main-content">
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
                        <td>
                            <button @click.stop="setSelectedVocab(vocab)" class="inv-button link">
                                {{vocab.text}}
                            </button>
                        </td>
                        <td>
                            <ul v-for="meaning in vocab.user_meanings" :key="meaning.id">{{meaning.text}}</ul>
                        </td>
                        <td>{{vocab.level}}</td>
                    </tr>
                    </tbody>
                </table>

                <the-meaning-panel
                        :vocab="selectedVocab"
                        class="meaning-panel">
                </the-meaning-panel>
            </section>
        </template>
    </base-card>
</template>

<script>
    import TheMeaningPanel from "@/components/reader/TheMeaningPanel";

    export default {
        name: "MyVocabPage",
        components: {TheMeaningPanel},
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
            }
        }
    }
</script>


<style scoped>
    .library-base-card {
        margin-left: 2vw;
        margin-right: 2vw;
        margin-bottom: 5vh;
    }

    .top-bar {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: stretch;
        margin-bottom: 1rem;
        column-gap: 0.5vw;
    }

    .course-lesson-select {
        flex-grow: 1;
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

    .main-content {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .vocab-table {
        flex: 2;
    }

    .meaning-panel {
        flex: 1;
    }
    .vocab-thead{
        border-bottom: 1px solid lightgray;
    }
    .vocab-thead th{
        padding-bottom: 0.5rem;
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
        padding: 1rem 0;
    }

</style>