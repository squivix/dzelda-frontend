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
                           :maxPerPage="$query.maxPerPage"
                           per-page-select-label="Vocabs Per Page"
                           :per-page-select-options="PER_PAGE_SELECT_OPTIONS">
      </pagination-controls>
    </template>
  </base-card>
</template>

<script>
import {ALL_VOCAB_LEVELS} from "@/constants.js";
import TheMeaningPanel from "@/components/general/shared/vocab-panel/TheMeaningPanel.vue";
import VocabTable from "@/components/page/my-vocabs/VocabTable.vue";
import VocabSearchFilter from "@/components/page/my-vocabs/VocabSearchFilter.vue";
import PaginationControls from "@/components/general/ui/PaginationControls.vue";
import {useVocabStore} from "@/stores/vocab";

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
  watch: {
    // TODO fix bug where going from ?page=2 then pressing back button does not trigger this refetch
    async "$query.page"() {
      await this.fetchVocabsPage();
    },
    async "$query.maxPerPage"() {
      this.refetchPage();
    },
    async "$query.searchQuery"() {
      this.refetchPage();
    },
    async "$query.level"() {
      this.refetchPage();
    },
  },
  async mounted() {
    await this.fetchVocabsPage();
  },
  methods: {
    async fetchVocabsPage() {
      this.clearSelectedVocab();
      this.loadingVocabs = true;
      const response = await this.vocabStore.fetchUserVocabs({
        language: this.$route.params.learningLanguage,
        searchQuery: this.$query.searchQuery,
        levels: [...this.$query.level],
        page: this.$query.page,
        vocabsPerPage: this.$query.maxPerPage,
      });
      this.vocabs = response.results;
      this.pageCount = Math.ceil(response.count / this.$query.maxPerPage);
      this.loadingVocabs = false;
    },
    refetchPage() {
      if (this.$query.page === 1)
        this.fetchVocabsPage();
      else
        this.$query.page = 1;
    },
    setSelectedVocab(vocab) {
      this.selectedVocab = vocab;
    },
    clearSelectedVocab() {
      this.selectedVocab = null;
    },
    onMeaningAdded(vocab, meaning) {
      vocab.userMeanings.push(meaning)
    },
    onVocabLevelSet(vocab, level) {
      if (level === ALL_VOCAB_LEVELS.IGNORED) {
        this.vocabs.splice(this.vocabs.findIndex((v) => v.text === vocab.text), 1)
        this.clearSelectedVocab();
      } else
        vocab.level = level;
    },
    onMeaningDeleted(vocab, meaning) {
      const index = vocab.userMeanings.findIndex((v) => v.text === meaning.text);
      if (index !== -1)
        vocab.userMeanings.splice(index, 1);
    }
  },
  created() {
    this.vocabStore = useVocabStore();
  }
}
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