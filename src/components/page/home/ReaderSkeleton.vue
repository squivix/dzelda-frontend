<template>
  <BaseCard class="skeleton">
    <template v-slot:all>
      <div class="top-row">
        <BaseImage class="image" :fallBackUrl="icons.bookOpen"/>
        <div class="title">
          <div class="line" v-for="_ in 2"></div>
        </div>
      </div>
      <div class="paragraph">
        <div class="line" v-for="_ in 10"></div>
      </div>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseImage from "@/components/ui/BaseImage.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import {icons} from "@/icons.js";

export default defineComponent({
  name: "ReaderSkeleton",
  components: {BaseCard, BaseImage},
  setup() {
    return {
      icons
    };
  },
});
</script>

<style scoped>

.skeleton {
  width: 50vw;
  max-width: 360px;
  padding: 1rem 1rem;
  border-radius: 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
}

.top-row {
  display: flex;
  column-gap: 1rem;
}

.paragraph {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.title {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.line {
  background-color: gainsboro;
  height: 1lh;
  width: 100%;
  border-radius: 10px;
}

.image {
  width: 60px;
  height: 60px;
}

:deep(.fallback-image svg) {
  width: 50px;
  height: 50px;
}

@media screen and (max-width: 750px) {
  .skeleton{
    row-gap: 0.5rem;
  }
  .top-row {
    flex-direction: column;
    align-items: center;
    row-gap: 0.5rem;
  }

  .title {
    width: 75%;
    row-gap: 0.25rem;
  }
}

@media screen and (max-width: 650px) {
  .skeleton {
    display: none;
  }
}
</style>
