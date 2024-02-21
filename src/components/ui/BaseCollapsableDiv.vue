<template>
  <!--       :style="refDebounced(input, 1000)"-->
  <div :class="{'collapsable-div':true, 'is-hidden':!isShown}"
       :style="{'--max-height-var':`${(maxHeight??defaultMaxHeightPx)+20}px`}"
       @transitionstart="onTransitionChanged(true)"
       @transitionend="onTransitionChanged(false)">
    <slot :setContentElement="(el:HTMLElement) =>contentsElement = el">

    </slot>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {refDebounced, useDebounceFn, useResizeObserver} from "@vueuse/core";

export default defineComponent({
  name: "BaseCollapsableDiv",
  emits: ["onTransitionChanged"],
  props: {
    isShown: {type: Boolean, required: true},
    defaultMaxHeightPx: {type: Number, default: 350}
  },
  data() {
    return {
      contentsElement: undefined as HTMLElement | undefined,
      maxHeight: undefined as number | undefined
    };
  },
  mounted() {
    useResizeObserver(document.body,
        useDebounceFn(() => {
          if (this.contentsElement)
            this.maxHeight = this.contentsElement.getBoundingClientRect().height;
        }, 1000));
  },
  watch: {
    contentsElement() {
      if (this.contentsElement)
        this.maxHeight = this.contentsElement.getBoundingClientRect().height;
    },
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
  --max-height-var: 350px;
}

.collapsable-div {
  max-height: var(--max-height-var, 350px);
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
