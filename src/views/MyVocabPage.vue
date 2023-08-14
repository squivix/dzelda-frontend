<template>
  <base-card title="My Vocabulary" class="my-vocab-base-card">
    <template v-slot:content>
      <section class="main-content" @click="clearSelectedVocab">
        <div class="bar-table-wrapper">
          <vocab-search-filter>
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
      <!--suppress JSUnresolvedVariable-->
      <pagination-controls v-if="pageCount"
                           :page-count="pageCount"
                           per-page-select-label="Vocabs Per Page"
                           :per-page-select-options="PER_PAGE_SELECT_OPTIONS">
      </pagination-controls>
    </template>
  </base-card>
</template>

<script lang="ts">
import constants from "@/constants";
import TheMeaningPanel from "@/components/shared/vocab-panel/TheMeaningPanel.vue";
import VocabTable from "@/components/page/my-vocabs/VocabTable.vue";
import VocabSearchFilter from "@/components/page/my-vocabs/VocabSearchFilter.vue";
import PaginationControls from "@/components/ui/PaginationControls.vue";
import {useVocabStore} from "@/stores/vocabStore.js";
import {useQuery} from "@oarepo/vue-query-synchronizer";
import {WatchStopHandle} from "vue";

export default {
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
  watch: {},
  async mounted() {
    await this.fetchVocabsPage();
    // TODO fix bug where going from ?page=2 then pressing back button does not trigger this refetch
    this.unwatchesOnRouteExit = [
      this.$watch("queryParams.page", this.fetchVocabsPage),
      this.$watch("queryParams.maxPerPage", this.refetchPage),
      this.$watch("queryParams.searchQuery", this.refetchPage),
      this.$watch("queryParams.level", this.refetchPage)
    ];
  },
  methods: {
    async fetchVocabsPage() {
      this.clearSelectedVocab();
      this.loadingVocabs = true;
      const response = await this.vocabStore.fetchUserVocabs({
        languageCode: this.$route.params.learningLanguage,
        searchQuery: this.queryParams.searchQuery,
        level: [...this.queryParams.level],
        page: this.queryParams.page,
        vocabsPerPage: this.queryParams.maxPerPage,
      });
      this.vocabs = response.data;
      this.pageCount = response.pageCount;
      this.loadingVocabs = false;
    },
    refetchPage() {
      if (!this.queryParams.page || this.queryParams.page === 1)
        this.fetchVocabsPage();
      else
        this.queryParams.page = 1;
    },
    setSelectedVocab(vocab) {
      this.selectedVocab = vocab;
    },
    clearSelectedVocab() {
      this.selectedVocab = null;
    },
    onMeaningAdded(vocab, meaning) {
      vocab.learnerMeanings.push(meaning);
    },
    onVocabLevelSet(vocab, level) {
      if (level === constants.ALL_VOCAB_LEVELS.IGNORED) {
        this.vocabs.splice(this.vocabs.findIndex((v) => v.text === vocab.text), 1);
        this.clearSelectedVocab();
      } else
        vocab.level = level;
    },
    onMeaningDeleted(vocab, meaning) {
      const index = vocab.learnerMeanings.findIndex((v) => v.text === meaning.text);
      if (index !== -1)
        vocab.learnerMeanings.splice(index, 1);
    }
  },
  beforeRouteLeave() {
    while (this.unwatchesOnRouteExit.length)
      (this.unwatchesOnRouteExit.pop())!();
  },
  setup() {
    return {
      vocabStore: useVocabStore(),
      queryParams: useQuery(),
      unwatchesOnRouteExit: [] as WatchStopHandle[]
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