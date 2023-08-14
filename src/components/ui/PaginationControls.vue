<template>
  <div class="pagination-div">
    <form id="per-page-form">
      <label for="per-page-select" v-if="perPageSelectLabel">{{ perPageSelectLabel }}</label>
      <!--suppress JSUnresolvedVariable-->
      <select id="per-page-select"
              :value="$query.maxPerPage"
              @change="setMaxPerPage($event.target.value)">
        <option v-for="option in perPageSelectOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </form>
    <!--suppress JSUnresolvedVariable -->
    <base-page-selector v-if="!!pageCount"
                        :current-page="$query.page??1"
                        :pageCount="pageCount"
                        :shown-count="Math.min(5,pageCount)"
                        @onPageClicked="goToPage">
    </base-page-selector>
  </div>
</template>

<script lang="ts">
import BasePageSelector from "@/components/ui/BasePageSelector.vue";

export default {
  name: "PaginationControls",
  components: {BasePageSelector},
  props: {
    perPageSelectOptions: {
      type: Array,
      required: false,
      default() {
        return [25, 50, 100, 150, 200]
      },
    },
    perPageSelectLabel: {
      type: String,
      required: false,
      default: "Max Per Page",
    },
    pageCount: {
      type: Number,
      required: true,
    },
  },
  methods: {
    setMaxPerPage(value) {
      this.$query.maxPerPage = Number(value);
    },
    goToPage(page) {
      this.$query.page = page;
    },
  }
}
</script>

<style scoped>

.pagination-div {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

#per-page-form {
  display: flex;
  flex-direction: row;
  column-gap: 0.5rem;
  justify-content: flex-start;
  align-items: center;
}

</style>