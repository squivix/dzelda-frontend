<template>
  <BaseCard title="Profile" class="my-profile-base-card main-page-base-card" v-if="userStore.userAccount">
    <template v-slot:all>
      <div class="profile-stats">
        <ProfileForm class="profile-wrapper"/>
        <div class="stats-wrapper">
          <RecentActivityChart :user="userStore.userAccount" :languages="languages"/>
          <AllTimeProgressChart :user="userStore.userAccount" :languages="languages"/>
        </div>

      </div>
      <!--      <BadgesSection/>-->
    </template>
  </BaseCard>
</template>

<script lang="ts">
import {useUserStore} from "@/stores/backend/userStore.js";
import BaseImage from "@/components/ui/BaseImage.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import ProfileForm from "@/components/page/my-profile/ProfileForm.vue";
import RecentActivityChart from "@/components/page/my-profile/RecentActivityChart.vue";
import AllTimeProgressChart from "@/components/page/my-profile/AllTimeProgressChart.vue";
import BadgesSection from "@/components/page/my-profile/BadgesSection.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import type {LanguageSchema} from "dzelda-common";

export default {
  name: "MyProfilePage",
  components: {BaseCard, BadgesSection, ProfileForm, AllTimeProgressChart, RecentActivityChart, BaseImage, InlineSvg},
  data() {
    return {
      languages: undefined as LanguageSchema[] | undefined,
    };
  },
  async mounted() {
    this.languages = await this.languageStore.fetchLanguages();
  },
  setup() {
    return {icons, languageStore: useLanguageStore(), userStore: useUserStore()};
  },
};
</script>

<style scoped>

.my-profile-base-card {
}

.profile-stats {
  display: flex;
  flex-direction: row;
  column-gap: 2rem;
}

.profile-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  row-gap: 1rem;
  flex: 1;
}

.stats-wrapper {
  flex: 3;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

@media screen and (max-width: 750px) {
  .profile-stats {
    flex-direction: column;
    align-items: stretch;
    row-gap: 1rem;
  }

  .profile-wrapper {
    width: unset;
  }

  :deep(.line-chart-wrapper) {
    width: unset;
    height: 350px;
  }

  :deep(.bar-chart-wrapper) {
    width: unset;
    height: 350px;
  }
}

</style>
