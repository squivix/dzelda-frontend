<template>
  <BaseCard title="My Vocabulary" class="my-vocab-base-card main-page-base-card">
    <template v-slot:content>
      <LoadingScreen v-if="loading"/>
      <section v-else>
        <div class="top-bar">
          <SearchBar :initial-search-query="queryParams.searchQuery"/>
          <button class="filter-button icon-wrapper" @click.stop="toggleFilters">
            <inline-svg :src="icons.filter"/>
          </button>
        </div>
        <VocabFilters :is-shown="isFiltersShown"
                      @on-filters-cleared="() => isFiltersShown=false"
                      @on-filters-applied="() => isFiltersShown=false"/>
        <div class="main-content">
          <div class="table-wrapper styled-scrollbars">
            <EmptyScreen v-if="!vocabs||vocabs.length==0" :has-filters="hasFilters">
              <template v-slot:no-filters>
                <div class="empty-screen">
                  <inline-svg :src="icons.vocabsList" class="empty-icon"/>
                  <p>Vocabs you lookup
                    <br>
                    will appear here</p>
                </div>
              </template>
              <template v-slot:with-filters>
                <div class="empty-screen">
                  <inline-svg :src="icons.search" class="empty-icon"/>
                  <p>No vocabs match your query</p>

                  <button @click="clearFilters" class="clear-filters-button inv-button link">
                    <inline-svg :src="icons.removeFilter"/>
                    Clear query
                  </button>
                </div>
              </template>
            </EmptyScreen>
            <VocabTable v-else
                        :vocabs="vocabs"
                        @onVocabClicked="setSelectedVocab"
                        @onVocabLevelSet="onVocabLevelSet">
            </VocabTable>
          </div>
          <div class="meaning-panel-wrapper" v-if="vocabs&&vocabs.length>0">
            <MeaningPanel
                :vocab="selectedVocab!"
                @click.stop
                @onMeaningAdded="onMeaningAdded"
                @onMeaningEdited="onMeaningEdited"
                @onVocabLevelSet="onVocabLevelSet"
                @onVocabNotesSet="onVocabNotesSet"
                @onMeaningDeleted="onMeaningDeleted"
                :class="{'meaning-panel':!!selectedVocab}">
              <template v-slot:no-selected-panel>
                <h4>Select a word or phrase</h4>
              </template>
            </MeaningPanel>
          </div>
        </div>
      </section>
      <PaginationControls v-if="pageCount"
                          :page-count="pageCount"
                          :page="queryParams.page"
                          :page-size="queryParams.pageSize"
                          :per-page-select-options="[25, 50, 100, 150, 200]"
                          per-page-select-label="Vocabs Per Page">
      </PaginationControls>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import MeaningPanel from "@/components/shared/vocab-panel/MeaningPanel.vue";
import VocabTable from "@/components/page/my-vocabs/VocabTable.vue";
import PaginationControls from "@/components/shared/PaginationControls.vue";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import {PropType} from "vue";
import {LearnerVocabSchema, MeaningSchema, VocabLevelSchema} from "dzelda-common";
import SearchBar from "@/components/ui/SearchBar.vue";
import VocabFilters from "@/components/shared/filters/VocabFilters.vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import BaseCard from "@/components/ui/BaseCard.vue";
import {useEventListener} from "@vueuse/core";

export default {
  name: "MyVocabPage",
  components: {
    InlineSvg, EmptyScreen, BaseCard, LoadingScreen, SearchBar,
    VocabFilters, VocabTable, PaginationControls, MeaningPanel
  },
  props: {
    pathParams: {
      type: Object as PropType<{ learningLanguage: string }>,
      required: true
    },
    queryParams: {
      type: Object as PropType<{ page: number, pageSize: number, searchQuery: string, level: VocabLevelSchema[] }>,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      vocabs: null as LearnerVocabSchema[] | null,
      selectedVocab: null as LearnerVocabSchema | null,
      pageCount: 0,
      isFiltersShown: false
    };
  },
  computed: {
    hasFilters() {
      return !!this.queryParams.searchQuery || !!this.queryParams.level;
    }
  },
  watch: {
    queryParams() {
      this.fetchVocabsPage();
    }
  },
  async mounted() {
    useEventListener(document, "click", this.clearSelectedVocab);
    await this.fetchVocabsPage();
  },
  methods: {
    async fetchVocabsPage() {
      this.clearSelectedVocab();
      this.loading = true;
      const response = await this.vocabStore.fetchUserVocabs({
        languageCode: this.pathParams.learningLanguage,
        searchQuery: this.queryParams.searchQuery || undefined,
        level: this.queryParams.level ?? [VocabLevelSchema.LEVEL1, VocabLevelSchema.LEVEL2, VocabLevelSchema.LEVEL3, VocabLevelSchema.LEVEL4, VocabLevelSchema.LEARNED, VocabLevelSchema.KNOWN],
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
      });
      this.vocabs = response.data!;
      this.pageCount = response.pageCount!;
      this.loading = false;
    },
    setSelectedVocab(vocab: LearnerVocabSchema) {
      this.selectedVocab = vocab;
    },
    clearSelectedVocab() {
      this.selectedVocab = null;
    },
    //TODO optimistically load updates to vocabs
    async onMeaningAdded(vocabId: number, newMeaning: MeaningSchema) {
      const updatedVocab = await this.updateVocab(vocabId);
      this.setSelectedVocab(updatedVocab);
    },
    async onMeaningEdited(vocabId: number, meaning: MeaningSchema) {
      const updatedVocab = await this.updateVocab(vocabId);
      this.setSelectedVocab(updatedVocab);
    },
    async onVocabLevelSet(vocabId: number, level: VocabLevelSchema) {
      if (level === VocabLevelSchema.IGNORED) {
        this.vocabs!.splice(this.vocabs!.findIndex((v) => v.id === vocabId), 1);
        this.clearSelectedVocab();
      } else {
        const updatedVocab = await this.updateVocab(vocabId);
        this.setSelectedVocab(updatedVocab);
      }
    },
    async onVocabNotesSet(vocabId: number, notes: string) {
      const updatedVocab = await this.updateVocab(vocabId);
      this.setSelectedVocab(updatedVocab);
    },
    async onMeaningDeleted(vocabId: number, meaning: MeaningSchema) {
      const updatedVocab = await this.updateVocab(vocabId);
      this.setSelectedVocab(updatedVocab);
    },
    toggleFilters() {
      this.isFiltersShown = !this.isFiltersShown;
    },
    clearFilters() {
      this.$router.push({
        query: {...this.$route.query, level: undefined, searchQuery: undefined, page: undefined}
      });
      this.isFiltersShown = false;
    },
    async updateVocab(vocabId: number) {
      const updatedVocab = await this.vocabStore.fetchUserVocab({vocabId: vocabId!});
      for (let i = 0; i < this.vocabs!.length; i++)
        if (this.vocabs![i].id == updatedVocab.id)
          this.vocabs![i] = updatedVocab;
      return updatedVocab;
    }
  },
  setup() {
    return {
      icons,
      vocabStore: useVocabStore(),
    };
  }
};
</script>


<style scoped>

.my-vocab-base-card {
}

section {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.main-content {
  display: flex;
  flex-direction: row;
  column-gap: 0.75rem;
}

.table-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 3;
  row-gap: 1rem;
  padding-right: 0.5rem;
  margin-bottom: 1rem;
  overflow-x: auto;
}

.top-bar {
  display: flex;
  column-gap: 0.25rem;
  align-self: flex-end;
  align-items: center;
}

.filter-button {
  border: 2px solid grey;
  border-radius: 5px;
  height: 35px;
  width: 35px;
}

.filter-button:hover {
  cursor: pointer;
}

.meaning-panel-wrapper {
  flex-grow: 1;
  max-width: 500px;
  flex-basis: 350px;
  align-self: flex-start;
}

.meaning-panel {
  border: 1px solid lightgray;
  padding: 0.5rem;
  border-radius: 5px;
}

.clear-filters-button {
  display: flex;
  align-items: center;
  column-gap: 1rem;
  font-size: 0.9rem;
}

.clear-filters-button svg {
  width: 20px;
  height: 20px;
}

@media screen and (max-width: 750px) {
  .main-content {
    flex-direction: column;
    row-gap: 1rem;
  }

  .meaning-panel-wrapper {
    max-width: unset;
    width: 100%;
  }
}
</style>
