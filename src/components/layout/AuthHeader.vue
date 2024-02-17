<template>
  <header>
    <div class="main-header unselectable">
      <div class="title-nav-div">
        <template v-if="doShowNavBar">
          <label for="nav-expand-checkbox">
            <inline-svg :src="icons.hamburgerMenu"/>
          </label>
          <input type="checkbox" id="nav-expand-checkbox" v-model="isNavBarExpanded">
        </template>
        <router-link :to="{ name: 'home'}" class="title inv-link">
          <img :src="logoSmall" class="logo-image" alt="logo">
          <h1>Dzelda</h1>
        </router-link>
        <NavBar v-if="doShowNavBar"/>
      </div>

      <div class="right-side-div" v-if="userAccount?.isEmailConfirmed">
        <LanguageDropDown/>
        <CreateTextButton/>
        <ProfileDropDown/>
      </div>
      <div v-else>
        <router-link :to="{ name: 'sign-out' }">
          <button class="sign-out-button big-button primary-filled-button capsule-button link">Sign Out</button>
        </router-link>
      </div>
    </div>
    <NavDropDown :isExpanded="isNavBarExpanded"/>
  </header>
</template>
<script lang="ts">
import BaseDropDown from "@/components/ui/BaseDropDown.vue";
import logoSmall from "@/assets/images/logo-small.svg";
import {icons} from "@/icons.js";
import {useStore} from "@/stores/backend/rootStore.js";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {defineComponent} from "vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import BaseImage from "@/components/ui/BaseImage.vue";
import InlineSvg from "vue-inline-svg";
import NavBar from "@/components/layout/header/NavBar.vue";
import NavDropDown from "@/components/layout/header/NavDropDown.vue";
import LanguageDropDown from "@/components/layout/header/LanguageDropDown.vue";
import ProfileDropDown from "@/components/layout/header/ProfileDropDown.vue";
import CreateTextButton from "@/components/layout/header/CreateTextButton.vue";

export default defineComponent({
  name: "AuthHeader",
  components: {ProfileDropDown, CreateTextButton, LanguageDropDown, NavDropDown, NavBar, BaseImage, BaseDropDown, InlineSvg},
  data() {
    return {isNavBarExpanded: false};
  },
  computed: {
    userLanguages() {
      return this.languageStore.userLanguages;
    },
    currentLanguage() {
      return this.userLanguages ? this.userLanguages[0] : null;
    },
    otherLanguages() {
      return this.userLanguages ? this.userLanguages!.filter(lang => lang.code !== this.currentLanguage!.code) : [];
    },
    userAccount() {
      return this.userStore.userAccount;
    },
    profilePicture() {
      return this.userAccount?.profile.profilePicture ?? "";
    },
    doShowNavBar() {
      return this.userAccount?.isEmailConfirmed && this.userLanguages && this.userLanguages.length > 0;
    }
  },
  watch: {
    $route() {
      this.isNavBarExpanded = false;
    }
  },
  async mounted() {
    await this.userStore.fetchUserAccount();
    if (this.userAccount?.profile)
      await this.languageStore.fetchUserLanguages();
  },
  setup() {
    return {
      icons,
      logoSmall,
      store: useStore(),
      userStore: useUserStore(),
      languageStore: useLanguageStore(),
    };
  }
});
</script>
<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 5;
}

.main-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 2vw;
  column-gap: 1rem;
  background-color: var(--primary-color);
}

header h1 {
  color: var(--on-primary-color);
}

header h1:hover {
  text-decoration: none;
}

h1 {
  font: 900 2rem sans-serif;
}

.logo-image {
  width: 64px;
  height: 64px;
  background-color: transparent;
  margin: 10px 0;
}

.title-nav-div {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  column-gap: min(3rem, 4vw);
}

.title {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
}

.title h1 {
  font-family: Verdana, sans-serif;
}

.right-side-div {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  column-gap: min(2vw, 15px);
  margin-right: 1rem;
}

.sign-out-button {
  min-width: 105px;
}


:deep(.dropdown-label) {
  display: flex;
  flex-direction: row;
  align-items: center;
}

#nav-expand-checkbox, label[for=nav-expand-checkbox] {
  display: none;
}

@media screen and (max-width: 750px) {
  .title-nav-div {
    column-gap: 1rem;
  }

  .title h1 {
    display: none;
  }

  label[for=nav-expand-checkbox] {
    display: block;
    color: var(--on-primary-color);
  }
}

</style>
