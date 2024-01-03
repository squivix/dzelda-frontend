<template>
  <div class="pagination-div">
    <form id="per-page-form">
      <label for="per-page-select" v-if="perPageSelectLabel">{{ perPageSelectLabel }}</label>
      <select id="per-page-select"
              :value="pageSize??perPageSelectOptions[0]"
              @change="setPageSize(Number(($event.target! as HTMLSelectElement).value))">
        <option v-for="option in perPageSelectOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </form>
    <!--  TODO show more pages if there's space for them-->
    <BasePageSelector v-if="!!pageCount"
                      :current-page="page"
                      :pageCount="pageCount"
                      :shownCount="Math.min(2,pageCount)"
                      :beforeCurrentCount="1"
                      @onPageClicked="goToPage">
    </BasePageSelector>
  </div>
</template>

<script lang="ts">
import BasePageSelector from "@/components/ui/BasePageSelector.vue";

export default {
  name: "PaginationControls",
  components: {BasePageSelector},
  emits: ["onPaginationChanged"],
  props: {
    page: {type: Number, required: false, default: 1},
    pageSize: {type: Number, required: false,},
    perPageSelectOptions: {
      type: Array, required: false, default() {
        return [5, 10, 25, 50, 100];
      },
    },
    perPageSelectLabel: {type: String, required: false, default: "Max Per Page",},
    pageCount: {type: Number, required: true,},
  },
  methods: {
    setPageSize(pageSize: number) {
      this.$router.push({query: {...this.$route.query, pageSize, page: undefined}});
    },
    goToPage(page: number) {
      this.$router.push({query: {...this.$route.query, page}});
    },
  }
};
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
