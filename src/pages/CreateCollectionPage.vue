<template>
  <BaseCard title="Create Collection" class="main-page-base-card">
    <template v-slot:content>
      <CreateCollectionForm :languageCode="pathParams.learningLanguage" @onCollectionCreated="redirectToEditPage"/>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import CreateCollectionForm from "@/components/shared/create-collection/CreateCollectionForm.vue";
import {CollectionSchema} from "dzelda-common";
import {PropType} from "vue";

export default {
  name: "CreateCollectionPage",
  components: {BaseCard, CreateCollectionForm},
  props: {
    pathParams: {type: Object as PropType<{ learningLanguage: string }>, required: true},
  },
  methods: {
    async redirectToEditPage(newCollection: CollectionSchema) {
      await this.$router.push({name: "edit-collection", params: {collectionId: newCollection.id}});
    }
  }

};
</script>

<style scoped>

</style>
