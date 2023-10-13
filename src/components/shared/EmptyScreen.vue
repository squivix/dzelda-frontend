<template>
  <div class="wrapper">
    <slot name="with-filters" v-if="hasFilters">
      <div class="empty-screen">
        <p v-if="!!resourceName">No {{ resourceName }} match your query</p>
        <p v-else>Nothing found that matches your query</p>
      </div>
    </slot>
    <slot name="no-filters" v-else>
      <div class="empty-screen">
        <p>Nothing found</p>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import loadingSpinner from "@/assets/images/loading-spinner.svg"
import InlineSvg from "vue-inline-svg";

export default defineComponent({
  name: "EmptyScreen",
  components: {InlineSvg},
  props: {
    resourceName: {type: String, required: false},
    hasFilters: {type: Boolean, required: false, default: false}
  },
  mounted() {
    console.log()
  }
})
</script>

<style scoped>
.wrapper {
  height: 50vh;
  display: grid;
  place-items: center;
  text-align: center
}


.empty-screen {
  color: grey;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

</style>