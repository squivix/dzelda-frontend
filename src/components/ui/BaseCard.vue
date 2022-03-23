<template>
  <div class="base-card">
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
  padding: 40px 5vw; 
}
header{
  margin-bottom: 2.5rem;
}
h2 {
  font-size: 2rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

</style>