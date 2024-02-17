<template>
  <LoadingScreen v-if="isLoading"/>
  <div class="wrapper">
    <EmptyScreen v-if="!texts||texts.length==0" :message="emptyMessage"/>
    <ul v-if="texts" class="texts-list">
      <TextListItem v-for="text in texts" :key="text.id" :text="text"/>
    </ul>
    <PaginationControls v-if="pageCount"
                        :page="page"
                        :page-size="pageSize"
                        :page-count="pageCount"
                        perPageSelectLabel="texts Per Page"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import TextListItem from "@/components/shared/content/TextListItem.vue";
import {TextSchema} from "dzelda-common";
import PaginationControls from "@/components/shared/PaginationControls.vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";

export default defineComponent({
  name: "TextsList",
  components: {EmptyScreen, LoadingScreen, PaginationControls, TextListItem},
  props: {
    texts: {type: Object as PropType<TextSchema[] | null>, required: true},
    isLoading: {type: Boolean, required: true},
    page: {type: Number},
    pageSize: {type: Number},
    pageCount: {type: Number, required: true},
    emptyMessage: {type: String, required: false, default: "No texts found."}
  }
});
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.texts-list {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}
</style>
