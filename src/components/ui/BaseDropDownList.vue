<template>
  <ul class="dropdown-list">
    <li v-for="(item, index) in listItems" :key="index" :class="item.class??''">

      <router-link v-if="item.link" :to="item.link">
        <inline-svg v-if="item.icon" :src="item.icon"/>
        <img class="image-icon" v-else-if="item.image" :src="item.image.src" :alt="item.image.alt">
        <span v-if="item.text">{{ item.text }}</span>
      </router-link>
      <template v-else>
        <inline-svg v-if="item.icon" :src="item.icon"/>
        <span v-if="item.text">{{ item.text }}</span>
      </template>
    </li>
  </ul>
</template>

<script lang="ts">
import {PropType} from "vue";
import {RouteLocationRaw} from "vue-router";
import InlineSvg from "vue-inline-svg";

export default {
  name: "BaseDropDownList",
  components: {InlineSvg},
  props: {
    listItems: {
      // TODO replace with slots
      type: Array as PropType<Array<{
        text?: string,
        link: RouteLocationRaw,
        class?: string,
        image?: { src: string, alt: String },
        icon?: string
      }>>,
      required: true
    }
  }
};
</script>

<style scoped>
.dropdown-list li a {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  column-gap: 0.5rem;
  align-items: center;

  margin: 0;
  padding: 0.5rem 0.5rem;
  width: 100%;
  height: 100%;
  color: black;
  font-family: sans-serif;
  font-size: 0.9rem;
}

.dropdown-list li a :only-child {
  margin: auto auto;
}

.dropdown-list li:hover {
  cursor: pointer;
  background-color: lightgray;
  border-radius: 3px;
}

.dropdown-list a:hover {
  text-decoration: none;
}

.image-icon {
  width: 15px;
  height: 15px;
}

</style>