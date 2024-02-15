<template>
  <BaseCard title="Update Collection" class="update-collection-base-card main-page-base-card">
    <template v-slot:content>
      <LoadingScreen v-if="isLoading || !collection"/>
      <form v-else class="update-collection-form" @submit.prevent="submitUpdateCollection">
        <div class="side-inputs">
          <div class="form-row">
            <ImageUploadInput id="collection-image-input" :oldImagePath="collection.image" name="collection image"
                              :fallback="icons.books" v-model="image"
                              :maxFileSizeInBytes="500_000"/>
            <p v-if="errorFields.image" class="error-message">{{ errorFields.image }}</p>
          </div>
          <div class="form-row ">
            <SubmitButton type="button" @click="onDeleteCollectionClicked" class="danger-button big-button capsule-button">Delete Collection</SubmitButton>
          </div>
        </div>

        <div class="main-inputs">
          <div class="form-row">
            <label for="collection-title">Title</label>
            <input id="collection-title" type="text" maxlength="255" placeholder="Collection Title" v-model="title" required>
            <p v-if="errorFields.title" class="error-message">{{ errorFields.title }}</p>
          </div>
          <div class="form-row">
            <label for="collection-description">Description</label>
            <textarea id="collection-description" maxlength="500" placeholder="Collection Description"
                      v-model="description"></textarea>
            <p v-if="errorFields.description" class="error-message">{{ errorFields.description }}</p>
          </div>
          <div class="form-row">
            <label for="lesson-table">Lessons</label>

            <p v-if="lessons?.length==0">No lessons in collection</p>
            <LessonOrderTable v-else v-model="lessons"/>
            <router-link :to="{name:'add-lesson', query:{collectionId:collection.id}}" class="inv-link add-lesson-button">
              <inline-svg :src="icons.plusRound" class="empty-icon"/>
              Add lesson
            </router-link>
          </div>
          <SubmitButton id="save-button"
                        type="submit"
                        class="primary-filled-button big-button capsule-button"
                        :is-submitting="isSubmitting">
            Save
          </SubmitButton>
        </div>
      </form>
      <ConfirmDialog :isShown="isDeleteCollectionConfirmShown" @onNoClicked="isDeleteCollectionConfirmShown=false" @onYesClicked="deleteCollection">
        <h3>Are you sure you want to delete this collection?</h3>
        <br>
        (This action cannot be undone. All lessons will be detached from collection)
      </ConfirmDialog>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import {VueDraggableNext} from "vue-draggable-next";
import {useCollectionStore} from "@/stores/backend/collectionStore.js";
import {CollectionSchema, LessonSchema} from "dzelda-common";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";
import ImageUploadInput from "@/components/shared/ImageUploadInput.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import LessonOrderTable from "@/components/page/edit-collection/LessonOrderTable.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import {PropType} from "vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import {useStore} from "@/stores/backend/rootStore.js";
import ConfirmDialog from "@/components/shared/ConfirmDialog.vue";
import {MessageType, useMessageBarStore} from "@/stores/messageBarStore.js";
import {useUserStore} from "@/stores/backend/userStore.js";

export default {
  name: "UpdateCollectionPage",
  components: {
    ConfirmDialog,
    LoadingScreen,
    EmptyScreen, LessonOrderTable, SubmitButton,
    ImageUploadInput, InlineSvg, BaseCard, draggable: VueDraggableNext,
  },
  props: {
    pathParams: {type: Object as PropType<{ learningLanguage: string, collectionId: number }>, required: true}
  },
  data() {
    return {
      collection: null as CollectionSchema | null,
      title: undefined as string | undefined,
      description: undefined as string | undefined,
      lessons: undefined as LessonSchema[] | undefined,
      image: undefined as Blob | "" | undefined,
      errorFields: {title: "", description: "", image: ""},
      isSubmitting: false,
      isLoading: false,
      isDeleteCollectionConfirmShown: false
    };
  },
  methods: {
    async submitUpdateCollection() {
      this.isSubmitting = true;
      let imageUrl;
      if (this.image)
        imageUrl = await this.store.uploadFile({
          fileField: "collectionImage",
          fileExtension: ".jpg",
          file: new File([this.image], "image.jpg"),
        });
      else
        imageUrl = this.image;

      const response = await this.collectionStore.updateCollection(
          {collectionId: this.pathParams.collectionId},
          {
            title: this.title!,
            description: this.description!,
            lessonsOrder: this.lessons!.map(lesson => lesson.id),
            image: imageUrl
          }
      );
      this.isSubmitting = false;
      if (response.ok)
        this.$router.push({name: "collection", ...this.pathParams});
      else {
        if ("fields" in response.error)
          this.errorFields = response.error.fields as { title: string, description: string, image: string };
      }
    },
    onDeleteCollectionClicked() {
      this.isDeleteCollectionConfirmShown = true;
    },
    async deleteCollection() {
      await this.collectionStore.deleteCollection({collectionId: this.pathParams.collectionId});
      this.isDeleteCollectionConfirmShown = false;
      this.messageBarStore.addMessage({type: MessageType.INFO, text: "Collection deleted"});
      this.$router.push({name: "home"});
    }
  },
  async mounted() {
    this.isLoading = true;
    const collection = await this.collectionStore.fetchCollection({collectionId: this.pathParams.collectionId});
    this.isLoading = false;
    if (collection.addedBy !== this.userStore?.userAccount?.username) {
      this.messageBarStore.addMessage({type: MessageType.ERROR, text: "User is not authorized to edit collection"});
      this.$router.push({name: "home"});
    }
    this.collection = collection;

    this.title = collection.title;
    this.description = collection.description;
    this.lessons = collection.lessons;
  },
  setup() {
    return {
      icons, store: useStore(),
      userStore: useUserStore(),
      messageBarStore: useMessageBarStore(),
      collectionStore: useCollectionStore()
    };
  }
};
</script>

<style scoped>

.update-collection-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1.25rem;
  justify-content: flex-start;
  align-items: stretch;
}

.update-collection-base-card:deep(header) {
  margin-bottom: 1rem;
}

.update-collection-form {
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
}

.main-inputs {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

label, h3 {
  font-size: 1.25rem;
}

input:not([type='checkbox']), select, textarea {
  font-size: 1rem;
}

#save-button {
  align-self: flex-start;
}

#collection-description {
  resize: none;
  height: 15vh;
}

.lessons-empty-screen > div, .add-lesson-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 0.5rem;
}

.add-lesson-button {
  color: grey;
}

.add-lesson-button svg {
  width: 30px;
  height: 30px;
}

.add-lesson-button:hover, .add-lesson-button:hover .empty-icon {
  color: var(--empty-list-icon-hover-color);
}


.form-row {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.side-inputs {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

@media screen and (max-width: 750px) {
  .update-collection-form {
    flex-direction: column;
  }
}

</style>
