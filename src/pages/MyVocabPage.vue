<template>
  <base-card title="My Vocabulary" class="my-vocab-base-card">
    <template v-slot:content>
      <LoadingScreen v-if="loading"/>
      <section class="main-content" @click="clearSelectedVocab" v-else>
        <div class="bar-table-wrapper">
          <div class="top-bar">
            <search-bar :initial-search-query="queryParams.searchQuery"/>
            <button class="filter-button" @click.stop="toggleFilters">
              <font-awesome-icon icon="filter"/>
            </button>
          </div>

          <vocab-filters :is-shown="isFiltersShown"
                         @on-filters-cleared="() => isFiltersShown=false"
                         @on-filters-applied="() => isFiltersShown=false"/>


          <p v-if="loading">Loading...</p>
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
                           :page="queryParams.page"
                           :page-size="queryParams.pageSize"
                           :per-page-select-options="[25, 50, 100, 150, 200]"
                           per-page-select-label="Vocabs Per Page">
      </pagination-controls>
    </template>
  </base-card>
</template>

<script lang="ts">
import constants from "@/constants";
import TheMeaningPanel from "@/components/shared/vocab-panel/TheMeaningPanel.vue";
import VocabTable from "@/components/page/my-vocabs/VocabTable.vue";
import PaginationControls from "@/components/shared/PaginationControls.vue";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import {PropType} from "vue";
import {LearnerVocabSchema, MeaningSchema, VocabLevelSchema} from "dzelda-types";
import SearchBar from "@/components/ui/SearchBar.vue";
import CourseFilters from "@/components/shared/filters/CourseFilters.vue";
import VocabFilters from "@/components/shared/filters/VocabFilters.vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
//TODO stop showing ignored vocabs
export default {
  name: "MyVocabPage",
  components: {LoadingScreen, CourseFilters, SearchBar, VocabFilters, VocabTable, PaginationControls, TheMeaningPanel},
  props: {
    pathParams: {
      type: Object as PropType<{
        learningLanguage: string
      }>,
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
  watch: {
    queryParams() {
      this.fetchVocabsPage();
    }
  },
  async mounted() {
    await this.fetchVocabsPage();
  },
  methods: {
    async fetchVocabsPage() {
      this.clearSelectedVocab();
      this.loading = true;
      const response = await this.vocabStore.fetchUserVocabs({
        languageCode: this.pathParams.learningLanguage,
        searchQuery: this.queryParams.searchQuery || undefined,
        level: this.queryParams.level,
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
    onMeaningAdded(vocab: LearnerVocabSchema, meaning: MeaningSchema) {
      vocab.learnerMeanings.push(meaning);
    },
    onVocabLevelSet(vocab: LearnerVocabSchema, level: VocabLevelSchema) {
      if (level === constants.ALL_VOCAB_LEVELS.IGNORED) {
        this.vocabs!.splice(this.vocabs!.findIndex((v) => v.text === vocab.text), 1);
        this.clearSelectedVocab();
      } else
        vocab.level = level;
    },
    onMeaningDeleted(vocab: LearnerVocabSchema, meaning: MeaningSchema) {
      const index = vocab.learnerMeanings.findIndex((v) => v.text === meaning.text);
      if (index !== -1)
        vocab.learnerMeanings.splice(index, 1);
    },
    toggleFilters() {
      this.isFiltersShown = !this.isFiltersShown;
    }
  },
  setup() {
    return {
      vocabStore: useVocabStore(),
    }
  }
};
</script>


<style scoped>

.my-vocab-base-card {
  width: 70vw;
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
  display: flex;
  column-gap: 0.25rem;
  align-self: flex-end;

}

.filter-button {
  border: 2px solid grey;
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

</style>