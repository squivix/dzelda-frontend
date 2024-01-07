<template>
    <span :class="wrapperClass"
          @mousedown.stop
          @click.stop="$emit('onWrapperClicked', $event.target as HTMLElement)"
          @mouseenter="$emit('wrapperHoverStart', $event.target as HTMLElement)"
          @mouseleave="$emit('wrapperHoverEnd', $event.target as HTMLElement)"
          :data-token-index="token.index">
      <span :class="wordClass"
            v-if="token.isWord"
            @click.stop="$emit('onWordClicked', $event.target as HTMLElement)">
          {{ token.text }}
      </span>
      <span @click.stop="$emit('onWrapperClicked',($event.target as HTMLElement))" v-else>
        <br v-if="token.text=='\n'">
        <template v-else>
            {{ token.text }}
        </template>
      </span>
    </span>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {LessonTokenObject} from "@/pages/LessonReaderPage.vue";

export default defineComponent({
  name: "BaseToken",
  props: {
    token: {type: Object as PropType<LessonTokenObject>, required: true},
    wrapperClass: {
      type: [String, Object, Array] as PropType<string | Record<string, boolean> | Array<string | Record<string, boolean>>>,
      default: ""
    },
    wordClass: {
      type: [String, Object, Array] as PropType<string | Record<string, boolean> | Array<string | Record<string, boolean>>>,
      default: ""
    },
  },
  emits: {
    onWordClicked: (target: HTMLElement) => true,
    onWrapperClicked: (target: HTMLElement) => true,
    wrapperHoverStart: (target: HTMLElement) => true,
    wrapperHoverEnd: (target: HTMLElement) => true,
  }

});
</script>

<style scoped>


span {
  user-select: text;
}

span::selection, br::selection {
  background: transparent;
}

.word {
  border: 1px solid transparent;
  padding: 0.05rem 0.1rem;
  border-radius: 5px;
  user-select: auto;
}

.word-hovered:hover {
  border: 1px solid darkblue;
  cursor: pointer;
}

.word-lone:hover {
  border: 1px solid darkblue;
  cursor: pointer;
}

.level-new:not(.phrase) {
  background-color: #aee0f4;
}

/*.level-new.phrase:hover {
  background-color: ghostwhite;
  cursor: default !important;
}*/

.level-1 {
  background-color: #ffeda1;
}

.level-2 {
  background-color: #fff2ab;
}

.level-3 {
  background-color: #fff6c7;
}

.level-4 {
  background-color: transparent;
  border-bottom: 1px dotted black;
}

/*.level-known,
.level-learned,
.level-ignored {
  background-color: transparent;
}*/

.word-wrapper {
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  border: 1px solid transparent;
}

.phrase:hover {
  cursor: pointer;
}

.phrase {
  transition: padding 0.35s ease-out;
}

.phrase-start {
  border-start-start-radius: 5px;
  border-end-start-radius: 5px;
}


.phrase-end {
  border-end-end-radius: 5px;
  border-start-end-radius: 5px;
}

.phrase-start.phrase-hovered {
  border-inline-start: 1px solid;
}


.phrase-end.phrase-hovered {
  border-inline-end: 1px solid;
}

.phrase-start:not(.phrase-hovered) {
  border-inline-start: 1px solid transparent;
}

.phrase-end:not(.phrase-hovered) {
  border-inline-end: 1px solid transparent;
}

.text-selected {
  background-color: #268AFA;
}

.phrase-hovered {
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
  border-top: 1px solid;
  border-bottom: 1px solid;
}


.word-selected.level-1,
.word-selected.level-2,
.word-selected.level-3,
.word-selected.level-4,
.phrase-selected.level-1,
.phrase-selected.level-2,
.phrase-selected.level-3,
.phrase-selected.level-4 {
  background-color: #e58d00 !important;

}

.word-selected, .phrase-selected {
  background-color: #3498db !important;
  color: #fff;
}

.phrase-selected .level-new,
.phrase-selected .level-1,
.phrase-selected .level-2,
.phrase-selected .level-3,
.phrase-selected .level-4 {
  color: black;
}
</style>
