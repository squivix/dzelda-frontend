<template>
  <ul class="dropdown-list">
    <li v-for="(item, index) in listItems" :key="index" :class="item.class??''">

      <router-link v-if="item.link" :to="item.link">
        <font-awesome-icon v-if="item.icon" :icon="item.icon"></font-awesome-icon>
        <img class="image-icon" v-else-if="item.image" :src="item.image.src" :alt="item.image.alt">
        <span v-if="item.text">{{ item.text }}</span>
      </router-link>
      <template v-else>
        <font-awesome-icon v-if="item.icon" :icon="item.icon"></font-awesome-icon>
        <span v-if="item.text">{{ item.text }}</span>
      </template>
    </li>
  </ul>
</template>

<script lang="ts">
export default {
  name: "BaseDropDownList",
  props: {
    listItems: {
      type: Array,
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
}

.dropdown-list a:hover {
  text-decoration: none;
}


.image-icon {
  width: 25px;
  height: 25px;
}

</style>