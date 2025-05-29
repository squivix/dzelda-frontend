<template>
  <BaseCard title="My Vocabulary" class="my-vocab-base-card main-page-base-card">
    <template v-slot:content>
      <LoadingScreen v-if="loading"/>
      <section v-else>
        <div class="top-bar">
          <SearchBar :initialSearchQuery="queryParams.searchQuery"/>
          <button class="filter-button icon-wrapper" @mousedown.stop @click.stop="toggleFilters">
            <inline-svg :src="icons.filter"/>
          </button>
        </div>
        <VocabFilters :is-shown="isFiltersShown"
                      :filters="{level:queryParams.level}"
                      @onFiltersCleared="() => isFiltersShown=false"
                      @onFiltersApplied="() => isFiltersShown=false"/>
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
                        @mousedown.stop
                        :selectedVocab="selectedVocab"
                        @onVocabClicked="setSelectedVocab">
            </VocabTable>
          </div>
          <div class="vocab-panel-wrapper" v-if="vocabs&&vocabs.length>0">
            <VocabPanel :class="{'vocab-panel':!!selectedVocab}"
                        :vocab="selectedVocab"
                        @mousedown.stop
                        @onVocabUpdated="updateVocabData"
                        @onVocabDeleted="removeVocabFromResults"
                        :onVocabRefetched="updateVocab">
              <template v-slot:no-selected-panel>
                <h4>Select a word or phrase</h4>
              </template>
            </VocabPanel>
          </div>
        </div>
      </section>
      <PaginationControls v-if="pageCount"
                          :page-count="pageCount"
                          :page="queryParams.page"
                          :pageSize="queryParams.pageSize"
                          :perPageSelectOptions="[25, 50, 100, 150, 200]"
                          perPageSelectLabel="Vocabs Per Page">
      </PaginationControls>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import VocabTable from "@/components/page/my-vocabs/VocabTable.vue";
import PaginationControls from "@/components/shared/PaginationControls.vue";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import {PropType} from "vue";
import {LearnerVocabSchema, VocabLevel, VocabLevelSchema} from "dzelda-common";
import SearchBar from "@/components/ui/SearchBar.vue";
import VocabFilters from "@/components/shared/filters/VocabFilters.vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import BaseCard from "@/components/ui/BaseCard.vue";
import {useEventListener} from "@vueuse/core";
import VocabPanel from "@/components/shared/vocab-panel/VocabPanel.vue";

export default {
  name: "MyVocabPage",
  components: {
    InlineSvg, EmptyScreen, BaseCard, LoadingScreen, SearchBar,
    VocabFilters, VocabTable, PaginationControls, VocabPanel
  },
  props: {
    pathParams: {type: Object as PropType<{ learningLanguage: string }>, required: true},
    queryParams: {
      type: Object as PropType<{
        page: number,
        pageSize: number,
        searchQuery: string,
        level: VocabLevelSchema[]
      }>, required: true,
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
    useEventListener(document, "mousedown", this.clearSelectedVocab);
    await this.fetchVocabsPage();
  },
  methods: {
    async fetchVocabsPage() {
      this.clearSelectedVocab();
      this.loading = true;
      const response = await this.vocabStore.fetchUserVocabs({
        languageCode: this.pathParams.learningLanguage,
        searchQuery: this.queryParams.searchQuery || undefined,
        level: this.queryParams.level ?? [VocabLevel.LEVEL_1, VocabLevel.LEVEL_2, VocabLevel.LEVEL_3, VocabLevel.LEVEL_4, VocabLevel.LEARNED],
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
      });
      this.vocabs = response.data!;
      this.pageCount = response.pageCount!;
      this.loading = false;
    },
    updateVocabData(vocab: LearnerVocabSchema, updatedVocabData: Partial<LearnerVocabSchema>) {
      if ([VocabLevel.IGNORED, VocabLevel.KNOWN].includes(updatedVocabData.level!)) {
        this.removeVocabFromResults(vocab);
        return;
      }
      const updatedVocab = {...vocab, ...updatedVocabData};
      for (let i = 0; i < this.vocabs!.length; i++)
        if (this.vocabs![i].id == updatedVocab.id)
          this.vocabs!.splice(i, 1, updatedVocab);
      if (this.selectedVocab && this.selectedVocab.text === vocab.text) {
        if ([VocabLevel.IGNORED, VocabLevel.KNOWN].includes(updatedVocabData.level!))
          this.clearSelectedVocab();
        else
          this.setSelectedVocab(updatedVocab);
      }
    },
    removeVocabFromResults(vocab: LearnerVocabSchema) {
      for (let i = 0; i < this.vocabs!.length; i++)
        if (this.vocabs![i].id == vocab.id) {
          if (this.selectedVocab?.id == this.vocabs![i].id)
            this.setSelectedVocab(this.vocabs![i + 1]);
          this.vocabs!.splice(i, 1);
          if (this.vocabs?.length == 0) {
            this.fetchVocabsPage().then(() => {
              //filter again to avoid when fetch might finish faster than its delete api call and then the list will still contain vocab
              const index = this.vocabs!.findIndex(v => v.id === vocab.id);
              if (index !== -1) this.vocabs!.splice(index, 1);
            })
          }
          return;
        }
    },
    async updateVocab(updatedVocab: LearnerVocabSchema) {
      for (let i = 0; i < this.vocabs!.length; i++)
        if (this.vocabs![i].id == updatedVocab.id)
          this.vocabs!.splice(i, 1, updatedVocab);
      if (this.selectedVocab && this.selectedVocab.text === updatedVocab.text) {
        if ([VocabLevel.IGNORED, VocabLevel.KNOWN].includes(updatedVocab.level!))
          this.clearSelectedVocab();
        else
          this.setSelectedVocab(updatedVocab);
      }
      return updatedVocab;
    },
    setSelectedVocab(vocab: LearnerVocabSchema) {
      this.selectedVocab = vocab;
    },
    clearSelectedVocab() {
      this.selectedVocab = null;
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

section {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.main-content {
  display: flex;
  flex-direction: row;
  column-gap: 0.75rem;
  margin-bottom: 1rem;
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
}

.filter-button {
  border: 2px solid grey;
  border-radius: 5px;
}

.filter-button:hover {
  cursor: pointer;
}

.vocab-panel-wrapper {
  max-width: 350px;
  flex-basis: 350px;
  align-self: flex-start;
}

.vocab-panel {
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

  .vocab-panel-wrapper {
    max-width: unset;
    width: 100%;
  }
}
</style>
