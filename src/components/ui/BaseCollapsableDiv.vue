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
</script>

<style scoped>

.collapsable-div {
  max-height: 1000px;
  overflow: hidden;
  transition-property: max-height;
  transition-duration: 0.5s;
}

.collapsable-div.is-hidden {
  max-height: 0;
}

.collapsable-div.is-hidden :deep(*) {
  pointer-events: none;
}

</style>
