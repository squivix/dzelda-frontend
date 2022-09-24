<template>
  <div ref="content" class="pointy-div">
    <slot>

    </slot>
  </div>
</template>

<script>
export default {
  name: "BasePointyDiv",
  mounted() {
    this.centerTriangle();
  },
  created() {
    window.addEventListener("resize", this.centerTriangle);
  },
  unmounted() {
    window.removeEventListener("resize", this.centerTriangle);
  },
  methods: {
    centerTriangle() {
      const contentWidth = this.$refs.content.getBoundingClientRect().width;
      this.$refs.content.style.setProperty("--triangle-translate", `${contentWidth / 2}px`);
    }
  }
};
</script>

<style scoped>
.pointy-div {
  background-color: white;
  /*border: 1px solid gray;*/
  min-width: 30px;
  box-sizing: border-box;
  border-radius: 5px;
}

.pointy-div:before,
.pointy-div:after {
  position: absolute;
  left: -1px;
  transform: translateX(calc(-50% + var(--triangle-translate, 0)));
  content: '';
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom-width: 10px;
  border-bottom-style: solid;
}

.pointy-div:before {
  top: -10px; /* extra -1 pixel offset at the top */
  border-bottom-color: gray;
}

.pointy-div:after {
  top: -10px;
  border-bottom-color: white;
}
</style>