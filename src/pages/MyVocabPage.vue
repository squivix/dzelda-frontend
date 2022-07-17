<template>
    <base-card title="My Vocabulary" class="library-base-card">
        <template v-slot:content>
            <section class="main-content" @click="clearSelectedVocab">
                <div class="bar-table-wrapper">

                    <div class="top-bar">
                        <form @submit.prevent="refreshQuery">
                            <input type="text" class="search-input" placeholder="Search" v-model.trim="searchQuery">
                            <button class="search-button">
                                <font-awesome-icon icon="magnifying-glass"></font-awesome-icon>
                            </button>
                        </form>
                        <button class="filter-button" @click="toggleFilters">
                            <font-awesome-icon icon="filter"></font-awesome-icon>
                        </button>
                    </div>

                    <form :class="{filters:true, 'filter-shown':filtersShown}" @submit="refreshQuery">
                        <label class="filter-label">Level</label>
                        <fieldset class="filter-levels">
                            <div class="checkbox-label">
                                <input id="filter-level-1-checkbox"
                                       type="checkbox"
                                       :value="vocabLevels.LEVEL_1"
                                       v-model="filteredLevels">
                                <label for="filter-level-1-checkbox">Level 1</label>
                            </div>
                            <div class="checkbox-label">
                                <input id="filter-level-2-checkbox"
                                       type="checkbox"
                                       :value="vocabLevels.LEVEL_2"
                                       v-model="filteredLevels">
                                <label for="filter-level-2-checkbox">Level 2</label>
                            </div>
                            <div class="checkbox-label">
                                <input id="filter-level-3-checkbox"
                                       type="checkbox"
                                       :value="vocabLevels.LEVEL_3"
                                       v-model="filteredLevels">
                                <label for="filter-level-3-checkbox">Level 3</label>
                            </div>
                            <div class="checkbox-label">
                                <input id="filter-level-4-checkbox"
                                       type="checkbox"
                                       :value="vocabLevels.LEVEL_4"
                                       v-model="filteredLevels">
                                <label for="filter-level-4-checkbox">Level 4</label>
                            </div>

                            <div class="checkbox-label">
                                <input id="filter-level-learned-checkbox"
                                       type="checkbox"
                                       :value="vocabLevels.LEARNED"
                                       v-model="filteredLevels">
                                <label for="filter-level-learned-checkbox">Learned</label>
                            </div>
                        </fieldset>
                        <button class="apply-filters">Apply</button>
                    </form>

                    <p v-if="loadingVocabs">Loading...</p>
                    <div class="vocab-table-wrapper" v-else-if="vocabs&&vocabs.length>0">
                        <table class="vocab-table">
                            <thead>
                            <tr>
                                <th>Vocab</th>
                                <th>Meanings</th>
                                <th>Level</th>
                            </tr>
                            </thead>
                            <tbody class="vocab-tbody">
                            <tr v-for="vocab in vocabs" :key="vocab.id">
                                <td @click.stop="setSelectedVocab(vocab)" class="link-parent">
                                    <button class="inv-button link">
                                        {{vocab.text}}
                                    </button>
                                </td>
                                <td>
                                    <ul>
                                        <li v-for="meaning in vocab.user_meanings"
                                            :key="meaning.id">
                                            {{meaning.text}}
                                        </li>
                                    </ul>
                                </td>
                                <td>
                                    <!--                                <vocab-level-display :level="vocab.level"></vocab-level-display>-->
                                    <vocab-level-picker :level="vocab.level"
                                                        :vocab-id="vocab.id"
                                                        @onVocabLevelSet="(level)=>onVocabLevelSet(vocab, level)"
                                    ></vocab-level-picker>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else>
                        <p>No vocabs added yet...</p>
                    </div>
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
            <div class="pagination-div">
                <form id="vocab-per-page-form">
                    <label for="vocab-per-page-select">Vocabs Per Page</label>
                    <select id="vocab-per-page-select" v-model="maxPerPage">
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="150">150</option>
                        <option value="200">200</option>
                    </select>
                </form>
                <base-page-selector v-if="!!pageCount"
                                    :current-page="currentPage"
                                    :pageCount="pageCount"
                                    :shown-count="Math.min(5,pageCount)"
                                    @onPageClicked="goToPage">
                </base-page-selector>
            </div>
        </template>
    </base-card>
</template>

<script>
    import TheMeaningPanel from "@/components/reader/TheMeaningPanel";
    import VocabLevelDisplay from "@/components/reader/VocabLevelDisplay";
    import {VOCAB_LEVELS} from "@/constants";
    import VocabLevelPicker from "@/components/reader/VocabLevelPicker";
    import BasePageSelector from "@/components/ui/BasePageSelector";

    export default {
        name: "MyVocabPage",
        components: {BasePageSelector, VocabLevelPicker, VocabLevelDisplay, TheMeaningPanel},
        data() {
            return {
                loadingVocabs: true,
                vocabs: null,
                selectedVocab: null,
                searchQuery: null,
                maxPerPage: 25,
                currentPage: 1,
                pageCount: 0,
                filtersShown: false,
                filteredLevels: [VOCAB_LEVELS.LEVEL_1, VOCAB_LEVELS.LEVEL_2, VOCAB_LEVELS.LEVEL_3, VOCAB_LEVELS.LEVEL_4, VOCAB_LEVELS.LEARNED]
            };
        },
        computed: {
            vocabLevels() {
                return VOCAB_LEVELS;
            },

        },
        async mounted() {
            await this.fetchVocabsPage();
        },
        watch: {
            async vocabsPerPage() {
                await this.fetchVocabsPage();
            }
        },
        methods: {
            async fetchVocabsPage() {
                this.clearSelectedVocab();
                this.loadingVocabs = true;
                const response = await this.$store.dispatch("fetchUserVocabsPage", {
                    language: this.$route.params.learningLanguage,
                    searchQuery: this.searchQuery,
                    levels: [...this.filteredLevels],
                    page: this.currentPage,
                    vocabsPerPage: this.maxPerPage,
                });
                this.vocabs = response.results;
                this.pageCount = Math.ceil(response.count / this.maxPerPage);
                this.loadingVocabs = false;
            },
            setSelectedVocab(vocab) {
                this.selectedVocab = vocab;
            },
            clearSelectedVocab() {
                this.selectedVocab = null;
            },
            goToPage(page) {
                //TODO make page transitions work with the browser's back/forth buttons
                this.currentPage = page;
                this.fetchVocabsPage();
            },
            async refreshQuery() {
                this.goToPage(1);
            },
            toggleFilters() {
                this.filtersShown = !this.filtersShown;
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
    }

    .bar-table-wrapper {
        display: flex;
        flex-direction: column;

        flex-grow: 3;
        row-gap: 1rem;
        padding-right: 0.5rem;
        margin-bottom: 1rem;
    }

    .top-bar {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;

        column-gap: 0.5vw;
    }

    .search-input {
    }

    .search-button {
        width: 30px;
        height: 30px;
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
        height: 30px;
    }

    .filter-button:hover {
        cursor: pointer;
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

    .vocab-table-wrapper {
        overflow-y: auto;
        max-height: 100vh;
    }

    .vocab-table {
        border-collapse: collapse;
        width: 100%;
    }

    .vocab-table tr {
        padding-right: 1rem;
        padding-left: 1rem;
    }

    .vocab-table thead th {
        background-color: white;
        padding-bottom: 0.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
        text-align: start;
        position: sticky;
        top: 0;
    }

    .vocab-table thead th:not(.centered-table-col) {
        text-align: start;
        vertical-align: middle;
        font-weight: bold;
    }

    .vocab-tbody tr:nth-child(odd) {
        background-color: whitesmoke;
    }

    .vocab-tbody td {
        padding: 1rem 1rem;
    }

    .vocab-tbody td button {
        font-size: 1rem;
        text-align: start;
    }

    .pagination-div {
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
    }

    #vocab-per-page-form {
        display: flex;
        flex-direction: row;
        column-gap: 0.5rem;
        justify-content: flex-start;
        align-items: center;
    }

    .filters-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        row-gap: 0.5rem;
    }

    .filters {
        display: flex;
        flex-direction: column;
        row-gap: 0.5rem;
        align-self: flex-end;
        border: 1px solid gray;
        border-radius: 5px;
        padding: 1rem;
        transition-property: max-height, border-color, padding;
        transition-delay: 0s, 0.5s;
        transition-duration: 0.5s, 0.001s;
    }

    .filter-label {
        font-weight: bold;
    }

    .filter-shown {
        max-height: 500px;
        transition-delay: 0.01s, 0s;
        transition-duration: 1s, 0.001s;
    }

    .filters:not(.filter-shown) {
        max-height: 0;
        padding-top: 0;
        padding-bottom: 0;
        border: 1px solid transparent;
    }

    .filters:not(.filter-shown) * {
        visibility: hidden;
        transition: visibility 0.4s;
        pointer-events: none;
    }

    .filter-levels {
        display: flex;
        flex-direction: row;
        column-gap: 1rem;
    }

    .apply-filters {
        align-self: flex-end;
        border-radius: 3px;
        padding: 0.5rem 0.5rem;
        font-size: 1rem;
        background-color: var(--primary-color);
        color: var(--on-primary-color);
        border: 1px solid var(--primary-color)
    }

    .apply-filters:hover {
        cursor: pointer;
    }
</style>