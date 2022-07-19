<template>
    <base-card title="My Vocabulary" class="library-base-card">
        <template v-slot:content>
            <section class="main-content" @click="clearSelectedVocab">
                <div class="bar-table-wrapper">
                    <search-filter @onSearchSubmitted="setSearchQuery"
                                   @onFilterApplied="applyFilters"
                                   :initial-search-query="initialSearchQuery">
                        <template v-slot:filters>
                            <!--                            <vocab-filters>-->
                            <!--                            </vocab-filters>-->
                        </template>
                    </search-filter>

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
            <pagination-controls v-if="pageCount"
                                 :page-count="pageCount"
                                 :maxPerPage="maxPerPage"
                                 :current-page="currentPage"
                                 per-page-select-label="Vocabs Per Page"
                                 :per-page-select-options="PER_PAGE_SELECT_OPTIONS"
                                 @onRefetchNeeded="fetchVocabsPage">
            </pagination-controls>
        </template>
    </base-card>
</template>

<script>
    import {VOCAB_LEVELS} from "@/constants";
    import PaginationControls from "@/components/ui/PaginationControls";
    import SearchFilter from "@/components/ui/SearchFilter";
    import TheMeaningPanel from "@/components/reader/TheMeaningPanel";
    import VocabTable from "@/components/reader/VocabTable";
    import VocabFilters from "@/components/reader/VocabFilters";


    export default {
        name: "MyVocabPage",
        components: {VocabFilters, VocabTable, PaginationControls, TheMeaningPanel, SearchFilter},
        data() {
            return {
                loadingVocabs: true,
                vocabs: null,
                selectedVocab: null,
                pageCount: 0,
                // filters,
                PER_PAGE_SELECT_OPTIONS: [25, 50, 100, 150, 200]
            };
        },
        computed: {
            initialSearchQuery() {
                return this.$route.query.searchQuery;
            },
            currentPage() {
                const queryPage = Number(this.$route.query.page);
                if (!Number.isNaN(queryPage) && queryPage > 0 && queryPage < this.pageCount)
                    return queryPage;
                else
                    return 1;
            }, maxPerPage() {
                const queryMaxPerPage = Number(this.$route.query.maxPerPage);
                if (!Number.isNaN(queryMaxPerPage) && this.PER_PAGE_SELECT_OPTIONS.includes(queryMaxPerPage))
                    return queryMaxPerPage;
                else
                    return this.PER_PAGE_SELECT_OPTIONS[0];
            }
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
                    // levels: [...this.filters.levels],
                    page: this.currentPage,
                    vocabsPerPage: this.maxPerPage,
                });
                this.vocabs = response.results;
                this.pageCount = Math.ceil(response.count / this.maxPerPage);
                this.loadingVocabs = false;
            }, setSearchQuery(searchQuery) {
                if (searchQuery)
                    this.$router.push({...this.$route, query: {...this.$route.query, searchQuery}});
                else
                    this.$router.push({...this.$route, query: {...this.$route.query, searchQuery: undefined}});
            },
            applyFilters() {
                this.$router.push({...this.$route, query: {...this.$route.query, level: this.filters.levels}});
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