<template>
  <div class="dropdown" ref="dropdown">
    <label :for="`dropdown-checkbox-${id}`" class="dropdown-label link" @click.prevent="triggerIsShown">
      <slot name="button" :isDroppedDown="isDroppedDown">

      </slot>
    </label>

    <input :id="`dropdown-checkbox-${id}`"
           type="checkbox" class="dropdown-checkbox"
           ref="dropdown-checkbox"
           name="dropdown-checkbox"
           v-model="isDroppedDown">
    <component :is="isPointy?'base-pointy-div':'div'"
               :class="{menu:true, 'pointy-menu':isPointy, 'centered-menu':centered, 'round-menu':round}">
      <slot name="menu">
      </slot>
    </component>
  </div>
</template>

<script lang="ts">

import BasePointyDiv from "@/components/ui/BasePointyDiv.vue";
import {onClickOutside, useEventListener} from "@vueuse/core";

export default {
  name: "BaseDropDown",
  components: {BasePointyDiv},
  props: {
    isPointy: {type: Boolean, required: false, default: false,},
    id: {type: String, required: true},
    centered: {type: Boolean, required: false, default: true},
    round: {type: Boolean, required: false, default: true}
  },
  data() {
    return {
      isDroppedDown: false
    };
  },
  watch: {
    $route() {
      this.hide();
    }
  },
  methods: {
    triggerIsShown() {
      this.isDroppedDown = !this.isDroppedDown;
    },
    hide() {
      this.isDroppedDown = false;
    }
  },
  mounted() {
    onClickOutside(this.$refs["dropdown"] as HTMLInputElement, this.hide);
  },
};
</script>

<style scoped>
.dropdown {
  position: relative;
}

.menu {
  position: absolute;
  margin-top: 0.1rem;
  text-align: center;
  border: none;
  background-color: var(--on-primary-color);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.4s linear, visibility 0s linear 0.4s;
  box-shadow: rgba(60, 64, 67, 0.3) 0 1px 2px 0, rgba(60, 64, 67, 0.15) 0 2px 6px 2px;
}

.centered-menu {
  left: 50%;
  transform: translate(-50%, 0px);
}

.round-menu {
  border-radius: 5px;
}

.pointy-menu {
  transform: translate(-50%, 15px);
}

.dropdown-checkbox {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
}

.dropdown-checkbox:checked + .menu {
  visibility: visible;
  opacity: 1;
  transition-delay: 0s;
}

</style>
