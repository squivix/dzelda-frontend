<template>
  <ul class="dropdown-list">
    <li v-for="(item, index) in listItems" :key="index">

      <router-link v-if="item.link" :to="item.link">
        <font-awesome-icon v-if="item.icon" :icon="item.icon"></font-awesome-icon>

        {{ item.text }}
      </router-link>
      <template v-else>
        <font-awesome-icon v-if="item.icon" :icon="item.icon"></font-awesome-icon>
        {{ item.text }}
      </template>
    </li>
  </ul>
</template>

<script>
export default {
  name: "BaseDropDownList",
  props: {
    listItems: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.dropdown-list {

}

.dropdown-list li {
  padding: 0;
}

.dropdown-list li a {
  margin: 0;
  width: 100%;
  height: 100%;
  color: black;
  font-family: sans-serif;
  font-size: 0.9rem;
  padding: 0.5rem 0;


  display: flex;
  flex-direction: row;
  justify-content: center;
  column-gap: 0.5rem;
  align-items: center;
}

.dropdown-list li:hover {
  cursor: pointer;
  background-color: lightgray;
}

.dropdown-list a:hover {
  text-decoration: none;
}


.profile-menu li a {
  display: flex;
  flex-direction: row;
  justify-content: center;
  column-gap: 0.5rem;
  align-items: center;
  padding: 1rem 0.5rem;
}
</style>