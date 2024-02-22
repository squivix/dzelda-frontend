<template>
  <LoadingScreen v-if="isLoading"/>
  <div class="wrapper">
    <template v-if="showSearchFilters">
      <div class="top-bar">
        <SearchBar :initialSearchQuery="searchQuery"/>
        <button class="filter-button icon-wrapper" @click.stop="toggleFilters" v-if="remainingFilters.size!=0">
          <inline-svg :src="icons.filter"/>
        </button>
      </div>
      <TextFilters v-if="remainingFilters.size!=0"
                   :isShown="isFiltersShown"
                   :filters="filters"
                   :excludedFilters="excludedFilters"
                   @onFiltersCleared="() => isFiltersShown=false"
                   @onFiltersApplied="() => isFiltersShown=false"/>
    </template>

    <EmptyScreen v-if="!texts||texts.length==0" :message="emptyMessage" :hasFilters="hasQuery">
      <template v-slot:no-filters>
        <div class="empty-screen">
          <slot name="empty-screen">
            <p>{{ emptyMessage }}</p>
          </slot>
        </div>
      </template>
      <template v-slot:with-filters>
        <div class="empty-screen">
          <inline-svg :src="icons.search" class="empty-icon"/>
          <p>No texts match your query</p>

          <button @click="clearFilters" class="clear-filters-button inv-button link">
            <inline-svg :src="icons.removeFilter"/>
            Clear query
          </button>
        </div>
      </template>
    </EmptyScreen>
    <ul v-if="texts" class="texts-list">
      <TextListItem v-for="text in texts" :key="text.id" :text="text" @onHideTextClicked="onHideTextClicked" @onReportTextClicked="onReportTextClicked"/>
    </ul>
    <PaginationControls v-if="pageCount"
                        :page="page"
                        :pageSize="pageSize"
                        :pageCount="pageCount"
                        perPageSelectLabel="Texts Per Page"/>

    <ConfirmDialog :isShown="isConfirmHideDialogShown" @onNoClicked="cancelHideText" @onYesClicked="hideText">
      <p>Are you sure you want to hide this text from your feed?</p>
    </ConfirmDialog>
    <ReportTextDialog :text="textToReport" :isShown="isReportTextDialogShown" @onCancelClicked="cancelReportText" @onReportSubmitted="onTextReported"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import TextListItem from "@/components/shared/content/TextListItem.vue";
import {TextSchema} from "dzelda-common";
import PaginationControls from "@/components/shared/PaginationControls.vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import SearchBar from "@/components/ui/SearchBar.vue";
import TextFilters, {TextFiltersObject, textFilterFields} from "@/components/shared/filters/TextFilters.vue";
import {isEmptyObject, setDifference} from "@/utils.js";
import ConfirmDialog from "@/components/shared/ConfirmDialog.vue";
import {useTextStore} from "@/stores/backend/textStore.js";
import ReportTextDialog from "@/components/shared/ReportTextDialog.vue";


export default defineComponent({
  name: "TextsList",
  emits: ["onTextHidden", "onTextReported"],
  components: {ReportTextDialog, ConfirmDialog, TextFilters, SearchBar, InlineSvg, EmptyScreen, LoadingScreen, PaginationControls, TextListItem},
  props: {
    texts: {type: Object as PropType<TextSchema[] | null>, required: true},
    isLoading: {type: Boolean, required: true},
    searchQuery: String,
    filters: {type: Object as PropType<TextFiltersObject>, default: {}},
    page: Number,
    pageSize: Number,
    pageCount: {type: Number, required: true},
    emptyMessage: {type: String, required: false, default: "No texts found."},
    showSearchFilters: {type: Boolean, default: true},
    excludedFilters: {type: Object as PropType<Set<keyof TextFiltersObject>>, required: false, default: new Set()}
  },
  data() {
    return {
      isFiltersShown: false,
      isConfirmHideDialogShown: false,
      isReportTextDialogShown: false,
      textToHide: null as TextSchema | null,
      textToReport: null as TextSchema | null,
    };
  },
  computed: {
    hasQuery() {
      return !isEmptyObject(this.filters) || !!this.searchQuery;
    },
    remainingFilters() {
      return setDifference(new Set(textFilterFields), this.excludedFilters);
    }
  },
  methods: {
    onHideTextClicked(textToHide: TextSchema) {
      this.textToHide = textToHide;
      this.isConfirmHideDialogShown = true;
    },
    onReportTextClicked(textToReport: TextSchema) {
      this.textToReport = textToReport;
      this.isReportTextDialogShown = true;
    },
    cancelHideText() {
      this.textToHide = null;
      this.isConfirmHideDialogShown = false;
    },
    cancelReportText() {
      this.textToReport = null;
      this.isReportTextDialogShown = false;
    },
    async hideText() {
      if (this.textToHide) {
        this.isConfirmHideDialogShown = false;
        await this.textStore.hideTextForUser({textId: this.textToHide.id});
        this.$emit("onTextHidden");
      }
    },
    onTextReported() {
      this.isReportTextDialogShown = false;
      this.textToReport = null;
      this.$emit("onTextReported");
    },
    toggleFilters() {
      this.isFiltersShown = !this.isFiltersShown;
    },
    clearFilters() {
      const clearedFilters: Partial<Record<keyof TextFiltersObject, undefined>> = {};
      textFilterFields.forEach(f => clearedFilters[f] = undefined);
      this.$router.push({
        query: {...this.$route.query, ...clearedFilters, searchQuery: undefined, page: undefined}
      });
      this.isFiltersShown = false;
    },
  },
  setup() {
    return {
      icons,
      textStore: useTextStore()
    };
  },
});
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
}

.texts-list {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  margin-bottom: 1rem;
}

.top-bar {
  display: flex;
  justify-content: flex-end;
  column-gap: 0.25rem;
  margin-bottom: 1rem;
}

.filter-button {
  border: 2px solid grey;
  border-radius: 5px;
  cursor: pointer;
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
</style>
