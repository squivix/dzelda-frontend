<template>
  <div class="dropdown">
    <label :for="`dropdown-checkbox-${label}`" class="dropdown-label link">
      <slot name="button">

      </slot>
    </label>

    <input :id="`dropdown-checkbox-${label}`"
           type="checkbox" class="dropdown-checkbox"
           ref="dropdown-checkbox"
           :name="group"
           @change="onCheckboxChange">
    <component :is="isPointy?'base-pointy-div':'div'" :class="{menu:true, 'pointy-menu':isPointy}">
      <slot name="menu">
      </slot>
    </component>
  </div>
</template>

<script>

import BasePointyDiv from "@/components/ui/BasePointyDiv.vue";

export default {
  name: "BaseDropDown",
  components: {BasePointyDiv},
  props: {
    isPointy: {
      type: Boolean,
      required: false,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      required: false,
      default: "default-group",
    }
  },
  methods: {
    onCheckboxChange(event) {
      if (event.target.checked) {
        const otherCheckboxes = document.querySelectorAll(`.dropdown-checkbox[name=${this.group}]:not([id=dropdown-checkbox-${this.label}])`)
        otherCheckboxes.forEach((checkbox) => {
          checkbox.checked = false
          checkbox.dispatchEvent(new Event('change'));
        });
      }
    }
  },
  watch: {
    '$route.path'() {
      this.$refs['dropdown-checkbox'].checked = false;
    }
  }
}
</script>

<style scoped>
.dropdown {
  position: relative;
}

.menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 0px);
  text-align: center;
  border: 1px solid gray;
  border-radius: 5px;
  background-color: var(--on-primary-color);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.4s linear, visibility 0s linear 0.4s;
}

.pointy-menu {
  transform: translate(-50%, 10px);
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