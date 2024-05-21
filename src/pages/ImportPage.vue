<template>
  <BaseCard class="import-base-card main-page-base-card">
    <template v-slot:header>
      <header>
        <div>
          <h2>{{ $route.meta.title }}</h2>
          <h3>{{ $route.meta.subtitle }}</h3>
        </div>
        <ul class="tab-labels">
          <li :class="{'current-tab':$route.name==='import-text-lang'}" class="tab-label"><router-link :to="{name:'import-text'}">
            <inline-svg :src="icons.plainText"/>
            Text
          </router-link></li>
          <li :class="{'current-tab':$route.name==='import-file-lang'}" class="tab-label"><router-link :to="{name:'import-file'}">
            <inline-svg :src="icons.pdfFile"/>
            <inline-svg :src="icons.epubFile"/>
            Document File
          </router-link></li>
        </ul>
      </header>
    </template>
    <template v-slot:content>

      <router-view>

      </router-view>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";

export default defineComponent({
  name: "ImportPage",
  components: {BaseCard, InlineSvg},
  setup() {
    return {icons};
  }
});
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 2rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  margin-bottom: 0.8rem;
}

h3 {
  font-size: 1.25rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: gray;
}

.tab-label svg {
  color: darkgray;
  width: 25px;
  height: 25px;
}

.tab-label > a {
  display: flex;
  align-items: center;
  column-gap: 0.25rem;
  text-decoration: none;
}
</style>
