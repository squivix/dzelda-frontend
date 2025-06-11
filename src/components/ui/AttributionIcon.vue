<template>
  <div v-if="attribution" class="attribution" @click.stop>
    <LoadingScreen v-if="isLoading"/>
    <template v-else>
      <img v-if="attributionSource?.logoUrl&&!logoError" :src="attributionSource.logoUrl" :alt="`${attributionSource.name} attribution logo`" class="attribution-icon" @error="logoError=true">
      <inline-svg v-else :src="icons.info" class="attribution-icon"/>
      <span class="attribution-popup" :style="{transform: `translateY(calc(-50% + ${scrollOffsetPx}px))`}">
        <div v-html="renderMarkdown(attribution?.attributionMarkdown)">

        </div>
      </span>
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {AttributionSchema, AttributionSourceSchema} from "dzelda-common";
import {renderMarkdown} from "@/utils.js";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";
import {useMeaningStore} from "@/stores/backend/meaningStore.js";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";

export default defineComponent({
  name: "AttributionIcon",
  components: {LoadingScreen, InlineSvg},
  props: {
    attribution: {type: [Object, null] as PropType<AttributionSchema | null>, required: true},
    attributionSourceId: {type: [Number] as PropType<number | undefined>, required: false},
    scrollOffsetPx: {type: Number, default: 0}
  },
  data() {
    return {
      logoError: false,
      attributionSource: null as AttributionSourceSchema | null,
      isLoading: true,
    };
  },
  async mounted() {
    const meaningStore = useMeaningStore()
    if (this.attributionSourceId) {
      this.isLoading = true;
      this.attributionSource = await meaningStore.fetchAttributionSource({attributionSourceId: this.attributionSourceId});
    }
    this.isLoading = false;
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

.loading-screen {
  height: auto;
  padding: 0;
}

.loading-screen:deep(.spinner) {
  width: 15px;
  height: 15px;
  color: white;
}
</style>
