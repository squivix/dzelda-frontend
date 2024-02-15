<template>
  <BaseCard title="Create Collection" class="main-page-base-card">
    <template v-slot:content>
      <CreateCollectionForm @onCollectionCreated="redirectToEditPage"/>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import CreateCollectionForm from "@/components/shared/create-collection/CreateCollectionForm.vue";
import {CollectionSchema} from "dzelda-common";

export default {
  name: "CreateCollectionPage",
  components: {BaseCard, CreateCollectionForm},
  methods: {
    async redirectToEditPage(newCollection: CollectionSchema) {
      await this.$router.push({name: "edit-collection", params: {collectionId: newCollection.id}});
    }
  }

};
</script>

<style scoped>

</style>
