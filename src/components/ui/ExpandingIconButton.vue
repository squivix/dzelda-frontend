<template>
  <component :is="!!linkTo?'RouterLink':'button'" :to="linkTo" @click="onClick"
             class="secondary-filled-button icon-text-button capsule-button">
    <template v-if="iconPosition=='left'">
      <inline-svg :src="iconSrc"/>
      <span :class="{'no-text': !isExpanded}">{{ text }}</span>
    </template>
    <template v-else>
      <span :class="{'no-text': !isExpanded}">{{ text }}</span>
      <inline-svg :src="iconSrc"/>
    </template>
  </component>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import InlineSvg from "vue-inline-svg";
import {RouteLocationRaw} from "vue-router";

export default defineComponent({
  name: "ExpandingIconButton",
  components: {InlineSvg},
  props: {
    text: {type: String, required: true},
    iconSrc: {type: String, required: true},
    isExpanded: {type: Boolean, required: true},
    linkTo: {type: Object as PropType<RouteLocationRaw>, required: false},
    iconPosition: {type: String as PropType<"left" | "right">, default: "left"}
  },
  emits: ["onClick"],
  methods: {
    onClick() {
      this.$emit("onClick");
    }
  }
})
</script>

<style scoped>
.no-text {
  font-size: 0;
}

span {
  transition: font-size 1s;
}
</style>
