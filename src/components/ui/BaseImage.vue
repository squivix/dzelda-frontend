<template>
  <img v-if="imageUrl&&!imageError" :src="imageUrl" @error="imageError=true" :alt="altText"
       class="image">
  <div v-else class="image fallback-image">
    <inline-svg :src="fallBackUrl"></inline-svg>
  </div>
</template>

<script lang="ts">
import InlineSvg from "vue-inline-svg";

export default {
  name: "BaseImage",
  components: {InlineSvg},
  data() {
    return {
      imageError: false,
    };
  },
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
    fallBackUrl: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
      required: false,
      default: "image",
    }
  }

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
  color: var(--on-primary-color);
}
</style>