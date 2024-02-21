<template>
  <div class="base-card">
    <slot name="all">
      <slot name="header">
        <header class="base-card-header">
          <h2>{{ title }}</h2>
          <h3>{{ subtitle }}</h3>
        </header>
      </slot>
      <slot name="content"></slot>
    </slot>
  </div>
</template>
<script lang="ts">
export default {
  name: "BaseCard",
  components: {},
  props: {
    title: {type: String, default: "",},
    subtitle: {type: String, default: ""},
  },
};
</script>
<style scoped>
div {
  border: 1px solid lightgray;
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 5px 0, rgba(0, 0, 0, 0.1) 0 0 1px 0;
  padding: 4.5rem 3vw;
  margin-bottom: 5vh;
}

header {
  margin-bottom: 1rem;
}

h2 {
  font-size: 2rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  margin-bottom: 0.5rem;
}

h3 {
  font-size: 1.25rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: gray;
}

@media screen and (max-width: 400px) {
  h3 {
    font-size: 1rem;
  }
}
</style>
