<template>
  <div class="home-page">
    <HeadingSection/>
    <FeaturesSection/>
    <TryItSection/>
    <SignUpSection/>
    <SupportUsSection/>
  </div>
</template>

<script lang="ts">
import {useUserStore} from "@/stores/backend/userStore.js";
import TryItSection from "@/components/page/home/TryItSection.vue";
import HeadingSection from "@/components/page/home/HeadingSection.vue";
import FeaturesSection from "@/components/page/home/FeaturesSection.vue";
import SignUpSection from "@/components/page/home/SignUpSection.vue";
import SupportUsSection from "@/components/page/home/SupportUsSection.vue";

export default {
  name: "HomePage",
  components: {SignUpSection, HeadingSection, TryItSection, FeaturesSection, SupportUsSection},
  beforeRouteEnter() {
    const userStore = useUserStore();
    if (userStore.isAuthenticated)
      return {name: "explore"};
  }
};
</script>
<style scoped>
.home-page {
  margin-left: 2rem;
  margin-right: 2rem;
}
</style>
