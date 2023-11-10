<template>
  <div class="base-card">
    <slot name="all">
      <slot name="header">
        <header class="base-card-header">
          <h2>{{ title }}</h2>
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
    title: {
      type: String,
      required: false,
      default: "",
    },
  },
};
</script>
<style scoped>
div {
  border: 1px solid var(--border-color);
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
  rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  padding: 4.5rem 3vw;
  margin-left: 2vw;
  margin-right: 2vw;
  margin-bottom: 5vh;
}

header {
  margin-bottom: 2.5rem;
}

h2 {
  font-size: 2rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
</style>
