<template>
  <div v-if="attribution" class="attribution" @click.stop>
    <img v-if="attribution.sourceRootLogoUrl&&logoError" :alt="`${attribution.sourceRootName} attribution logo`" class="attribution-icon" @error="logoError=true">
    <inline-svg v-else :src="icons.info" class="attribution-icon"/>
    <span class="attribution-popup">
      <div v-html="renderMarkdown(attribution?.attributionMarkdown)">

      </div>
  </span>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {AttributionSchema} from "dzelda-common";
import {renderMarkdown} from "@/utils.js";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";

export default defineComponent({
  name: "AttributionIcon",
  components: {InlineSvg},
  props: {
    attribution: {type: [Object, null] as PropType<AttributionSchema | null>, required: true},
  },
  data() {
    return {
      logoError: false
    };
  },
  setup() {
    return {
      icons,
      renderMarkdown
    };
  }
});
</script>

<style scoped>

.attribution {
  padding-right: 1rem;
  padding-left: 0.5rem;
  align-self: stretch;
  display: grid;
  cursor: default;
  place-items: center;
  color: white;
}

.attribution-icon {
  width: 20px;
  height: 20px;
}


.attribution-popup {
  display: none;
  position: absolute;
  transform: translateY(-40px);
  padding: 1rem;
}

.attribution-popup div {
  background-color: var(--background-color);
  border: 1px solid var(--on-background-color);
  color: var(--on-background-color);
  padding: 0.2rem;
  font-size: 0.75rem;
  max-width: 250px;
}

.attribution:hover .attribution-popup {
  display: block;
}

</style>
