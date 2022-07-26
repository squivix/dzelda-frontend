<template>
    <base-card title="My Vocabulary" class="my-vocab-base-card">
        <template v-slot:content>
            <section class="main-content" @click="clearSelectedVocab">
                <div class="bar-table-wrapper">
                    <vocab-search-filter
                            :initial-filters="filters"
                            @onSearchSubmitted="refetchPage"
                            @onFiltersApplied="refetchPage">
                    </vocab-search-filter>

                    <p v-if="loadingVocabs">Loading...</p>
                    <vocab-table v-else-if="vocabs&&vocabs.length>0"
                                 :vocabs="vocabs"
                                 @onVocabClicked="setSelectedVocab"
                                 @onVocabLevelSet="onVocabLevelSet">

                    </vocab-table>
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
            <!--suppress JSUnresolvedVariable -->
            <pagination-controls v-if="pageCount"
                                 :page-count="pageCount"
                                 :maxPerPage="maxPerPage"
                                 :current-page="currentPage"
                                 per-page-select-label="Vocabs Per Page"
                                 :per-page-select-options="PER_PAGE_SELECT_OPTIONS">
            </pagination-controls>
        </template>
    </base-card>
</template>

<script>
    import {ALL_LEVELS, SAVED_VOCAB_LEVELS} from "@/constants";
    import PaginationControls from "@/components/ui/PaginationControls";
    import {paginationControlsHost} from "@/components/ui/PaginationControls";
    import TheMeaningPanel from "@/components/reader/TheMeaningPanel";
    import VocabTable from "@/components/reader/VocabTable";
    import VocabSearchFilter from "@/components/reader/VocabSearchFilter";
    import {updateQueryParams} from "@/components/reader/shared";
    import {mergeDeep} from "@/utils";

    let MyVocabPage = {
        name: "MyVocabPage",
        components: {VocabSearchFilter, VocabTable, PaginationControls, TheMeaningPanel},
        data() {
            return {
                loadingVocabs: true,
                vocabs: null,
                selectedVocab: null,
                pageCount: 0,
                PER_PAGE_SELECT_OPTIONS: [25, 50, 100, 150, 200]
            };
        },

        computed: {
            filters() {
                const savedLevelsArray = Object.values(SAVED_VOCAB_LEVELS);
                const filters = {levels: savedLevelsArray};
                if (this.$route.query.level) {
                    const queryLevels = [...this.$route.query.level].map(l => Number(l)).filter(l => savedLevelsArray.includes(l));
                    filters.levels = queryLevels;
                }
                return filters;
            },
        },
        watch: {
            async currentPage() {
                await this.fetchVocabsPage();
            },
            async maxPerPage() {
                if (this.currentPage === 1)
                    await this.fetchVocabsPage();
            }
        },
        async mounted() {
            await this.fetchVocabsPage();
        },
        methods: {
            async fetchVocabsPage() {
                this.clearSelectedVocab();
                this.loadingVocabs = true;
                const response = await this.$store.dispatch("fetchUserVocabsPage", {
                    language: this.$route.params.learningLanguage,
                    searchQuery: this.$route.query.searchQuery,
                    levels: [...this.filters.levels],
                    page: this.currentPage,
                    vocabsPerPage: this.maxPerPage,
                });
                this.vocabs = response.results;
                this.pageCount = Math.ceil(response.count / this.maxPerPage);
                this.loadingVocabs = false;
            },
            refetchPage() {
                if (this.currentPage === 1)
                    this.fetchVocabsPage();
                else
                    this.currentPage = 1;
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
                if (level === ALL_LEVELS.IGNORED) {
                    this.vocabs.splice(this.vocabs.findIndex((v) => v.text === vocab.text), 1)
                    this.clearSelectedVocab();
                } else
                    vocab.level = level;
            },
            onMeaningDeleted(vocab, meaning) {
                const index = vocab.user_meanings.findIndex((v) => v.text === meaning.text);
                if (index !== -1)
                    vocab.user_meanings.splice(index, 1);
            }
        }
    }
    MyVocabPage = mergeDeep(MyVocabPage, paginationControlsHost)
    export default MyVocabPage;
</script>


<style scoped>

    .my-vocab-base-card {
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

</style>