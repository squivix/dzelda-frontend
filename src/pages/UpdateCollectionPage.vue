<template>
  <BaseCard title="Update Collection" class="update-collection-base-card main-page-base-card">
    <template v-slot:content>
      <LoadingScreen v-if="isLoading || !collection"/>
      <form v-else class="update-collection-form" @submit.prevent="submitUpdateCollection">
        <div class="side-inputs">
          <div class="form-row">
            <ImageUploadInput id="collection-image-input" :oldImageUrl="collection.image"
                              name="collection image"
                              :fallback="icons.books" v-model="image"
                              :maxFileSizeInBytes="mebiBytes(1)"/>
            <p v-if="errorFields.image" class="error-message">{{ errorFields.image }}</p>
          </div>
          <div class="form-row ">
            <SubmitButton type="button" @click="onDeleteCollectionClicked"
                          class="danger-button big-button capsule-button">Delete Collection
            </SubmitButton>
          </div>
        </div>

        <div class="main-inputs">
          <div class="form-row">
            <label for="collection-title">Title</label>
            <input id="collection-title" type="text" maxlength="255" placeholder="Collection Title"
                   v-model="title"
                   required>
            <p v-if="errorFields.title" class="error-message">{{ errorFields.title }}</p>
          </div>
          <div class="form-row">
            <label for="collection-description">Description</label>
            <textarea id="collection-description" maxlength="500"
                      placeholder="Collection Description"
                      v-model="description"></textarea>
            <p v-if="errorFields.description" class="error-message">{{
                errorFields.description
              }}</p>
          </div>
          <div class="form-row">
            <label for="text-table">Texts</label>
            <p v-if="texts?.length==0">No texts in collection</p>
            <TextsOrderTable v-else v-model="texts"/>
            <router-link :to="{name:'import-text', query:{collectionId:collection.id}}"
                         class="inv-link add-text-button">
              <inline-svg :src="icons.plusRound" class="empty-icon"/>
              Add text
            </router-link>
          </div>
          <div class="form-row">
            <label for="collection-is-public-checkbox" class="checkbox-label">
              <input type="checkbox" id="collection-is-public-checkbox" v-model="isPublic">
              Public
            </label>
          </div>
          <SubmitButton id="save-button"
                        type="submit"
                        class="primary-filled-button big-button capsule-button"
                        :is-submitting="isSubmitting">
            Save
          </SubmitButton>
        </div>
      </form>
      <ConfirmDialog :isShown="isDeleteCollectionConfirmShown"
                     @onNoClicked="isDeleteCollectionConfirmShown=false"
                     @onYesClicked="deleteCollection">
        <h3>Are you sure you want to delete this collection?</h3>
        <label style="font-size: 1rem"><input type="checkbox" v-model="cascadeTextsDelete">Also
          delete all texts in this collection</label>
        (This action cannot be undone.)
      </ConfirmDialog>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import {VueDraggableNext} from "vue-draggable-next";
import {useCollectionStore} from "@/stores/backend/collectionStore.js";
import type {CollectionSchema, TextSchema} from "dzelda-common";
import {mebiBytes} from "dzelda-common";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";
import ImageUploadInput from "@/components/shared/ImageUploadInput.vue";
import SubmitButton from "@/components/ui/SubmitButton.vue";
import TextsOrderTable from "@/components/page/edit-collection/TextsOrderTable.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import type {PropType} from "vue";
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
    EmptyScreen, TextsOrderTable, SubmitButton,
    ImageUploadInput, InlineSvg, BaseCard, draggable: VueDraggableNext,
  },
  props: {
    pathParams: {
      type: Object as PropType<{ learningLanguage: string, collectionId: number }>,
      required: true
    }
  },
  data() {
    return {
      collection: null as CollectionSchema | null,
      title: undefined as string | undefined,
      description: undefined as string | undefined,
      texts: undefined as TextSchema[] | undefined,
      image: undefined as Blob | "" | undefined,
      isPublic: true,
      errorFields: {title: "", description: "", image: ""},
      isSubmitting: false,
      isLoading: false,
      isDeleteCollectionConfirmShown: false,
      cascadeTextsDelete: true
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
          isPublic: this.isPublic,
          textsOrder: this.texts!.map(text => text.id),
          image: imageUrl
        }
      );
      this.isSubmitting = false;
      if (response.ok)
        this.$router.push({name: "collection", ...this.pathParams});
      else {
        if ("fields" in response.error)
          this.errorFields = response.error.fields as {
            title: string,
            description: string,
            image: string
          };
      }
    },
    onDeleteCollectionClicked() {
      this.isDeleteCollectionConfirmShown = true;
    },
    async deleteCollection() {
      await this.collectionStore.deleteCollection({collectionId: this.pathParams.collectionId}, {cascadeTexts: this.cascadeTextsDelete});
      this.isDeleteCollectionConfirmShown = false;
      this.messageBarStore.addTopBarMessage({type: MessageType.INFO, text: "Collection deleted"});
      this.$router.push({name: "home"});
    }
  },
  async mounted() {
    this.isLoading = true;
    const collection = await this.collectionStore.fetchCollection({collectionId: this.pathParams.collectionId});
    this.isLoading = false;
    if (collection.addedBy !== this.userStore?.userAccount?.username) {
      this.messageBarStore.addTopBarMessage({
        type: MessageType.ERROR,
        text: "User is not authorized to edit collection"
      });
      this.$router.push({name: "home"});
    }
    this.collection = collection;

    this.title = collection.title;
    this.description = collection.description;
    this.isPublic = collection.isPublic;
    this.texts = collection.texts;
  },
  setup() {
    return {
      icons,
      mebiBytes,
      store: useStore(),
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

.texts-empty-screen > div, .add-text-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 0.5rem;
}

.add-text-button {
  color: grey;
}

.add-text-button svg {
  width: 30px;
  height: 30px;
}

.add-text-button:hover, .add-text-button:hover .empty-icon {
  color: var(--empty-list-icon-hover-color);
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
