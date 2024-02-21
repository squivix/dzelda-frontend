<template>
  <div :class="{'collapsable-div':true, 'is-hidden':!isShown}"
       @transitionstart="onTransitionChanged(true)"
       @transitionend="onTransitionChanged(false)">
    <slot>

    </slot>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "BaseCollapsableDiv",
  emits: ["onTransitionChanged"],
  props: {
    isShown: {type: Boolean, required: true},
    toggleElementRef: {type: HTMLElement}
  },
  methods: {
    onTransitionChanged(isTransitioning: boolean) {
      this.$emit("onTransitionChanged", isTransitioning);
    }
  }
});
// TODO set max height with js
</script>

<style scoped>

.collapsable-div {
  max-height: 350px;
  overflow: hidden;
  padding: 5px;
  transition-property: max-height, padding;
  transition-duration: 0.5s;
}

.collapsable-div.is-hidden {
  padding-top: 0;
  padding-bottom: 0;
  max-height: 0;
}

.collapsable-div.is-hidden :deep(*) {
  pointer-events: none;
}

</style>
