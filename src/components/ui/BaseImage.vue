<template>
  <template v-if="imageUrl&&!imageError">
    <img :src="imageUrl" @error="imageError=true" :alt="altText"
         :class="{'image':true,'circular':circular}">
  </template>
  <div v-else :class="{'image':true, 'fallback-image':true,'circular':circular}">
    <inline-svg :src="fallBackUrl!"/>
  </div>
</template>

<script lang="ts">
import InlineSvg from "vue-inline-svg";

export default {
  name: "BaseImage",
  components: {InlineSvg},
  props: {
    imageUrl: {type: String, required: false},
    fallBackUrl: {type: String, required: false},
    circular: {type: Boolean, required: false, default: false},
    altText: {type: String, required: false, default: "image"}
  },
  watch: {
    imageUrl() {
      this.imageError = false;
    }
  },
  data() {
    return {
      imageError: false,
    };
  },
};
</script>

<style scoped>

.image {
  width: 200px;
  height: 200px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
  flex-shrink: 0;
}

.fallback-image {
  flex-shrink: 0;
  background-color: var(--primary-color);
  display: grid;
  place-items: center;
}

.fallback-image svg {
  width: 120px;
  height: 120px;
  /*TODO replace all fills inside the svgs with current color so we don't have to specify fill in the css only color*/
  color: var(--on-primary-color);
}

.circular {
  border-radius: 50%;
}
</style>
