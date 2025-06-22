<template>
  <article class="language">
    <span class="is-learning-check icon-wrapper" :class="{'invisible':!language.isLearning}">
        <inline-svg :src="icons.checkMark"/>
    </span>
    <div class="inner-language-div">
      <img :src="language.flagCircular!" :alt="`${language.code} language flag`"
           class="language-flag">
      <div class="title-learners">
        <h4>{{ language.name }}</h4>
        <p>{{ language.learnersCount }} learners</p>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import InlineSvg from "vue-inline-svg";
import type {LanguageSchema} from "dzelda-common";
import {icons} from "@/icons.js";

export default defineComponent({
  name: "LanguageCard",
  components: {InlineSvg},
  props: {
    language: {
      type: Object as PropType<LanguageSchema & {
        isLearning: boolean
      }>, required: true
    }
  },
  methods: {},
  setup() {
    return {icons};
  }
});
</script>

<style scoped>

.language {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
  border: 1px solid lightgray;
  border-radius: 10px;
  transition: transform 0.15s ease-out;
  overflow: hidden;
  box-sizing: border-box;
  height: 100%;
}

.language:hover {
  transform: scale(1.04);
  cursor: pointer;
}

.inner-language-div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 1rem;
}

.title-learners {
  line-height: 1.25rem;
  text-align: center;
}

h4 {
  font-size: 1.2rem;
}

p {
  font-size: 0.9rem;
  color: darkslategray;
}

.language-flag {
  width: 125px;
  height: 125px;
}

.is-learning-check {
  background-color: var(--secondary-color);
  color: var(--on-secondary-color);
  padding: 0.35rem;
  overflow: visible;
  border-radius: 3px;
  align-self: flex-end;
}

</style>
