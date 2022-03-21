<template>
  <div>
    <slot name="all">
      <slot name="header">
        <header>
          <h2>{{ title }}</h2>
        </header>
      </slot>
      <slot name="content"></slot>
    </slot>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
<style scoped>
div {
  border: 1px solid var(--border-color);
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
    rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  padding: 30px 10vw;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}
h2 {
  font-size: 1.75rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
</style>