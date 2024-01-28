<template>
  <section>
    <div>
      <h1 class="heading">Learn languages by reading</h1>
      <p class="sub-heading">Dzelda helps you read in any language.</p>
      <a href="#try-it-header">
        <button class="primary-filled-button big-button capsule-button link">Try it yourself</button>
      </a>
    </div>
    <img :src="logo" class="logo-image" alt="logo">
    <!--    <ReaderSkeleton/>-->
    <div>

    </div>
  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseImage from "@/components/ui/BaseImage.vue";
import logo from "@/assets/images/logo.svg";
import ReaderSkeleton from "@/components/page/home/ReaderSkeleton.vue";

export default defineComponent({
  name: "HeadingSection",
  components: {ReaderSkeleton, BaseImage, BaseCard},
  setup() {
    return {logo};
  },
});
</script>

<style scoped>
section {
  margin-top: 2vh;
  min-height: 35vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  column-gap: 0.5rem;
}

.heading {
  font-size: 3.5rem;
  margin-bottom: 3rem;
}

.sub-heading {
  font-size: 1.5rem;
  color: gray;
  margin-bottom: 1.5rem;
}

.logo-image {
  width: 30vw;
  max-width: 360px;
}

@media screen and (max-width: 750px) {
  .heading {
    font-size: 3rem;
  }

  .logo-image {
    width: 25vw;
  }
}
@media screen and (max-width: 700px){

  .logo-image {
    display: none;
  }
}
</style>
