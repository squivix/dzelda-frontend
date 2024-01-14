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
        <router-link :to="{ name: 'home'}" class="title">
          <img :src="logo" class="logo-image" alt="logo">
          <!--        <h1>Dzelda</h1>-->
        </router-link>
        <NavBar v-if="doShowNavBar"/>
      </div>

      <div class="right-side-div" v-if="userAccount?.isEmailConfirmed">
        <BaseDropDown v-if="currentLanguage" class="language-dropdown" id="language">
          <template v-slot:button="{isDroppedDown}">
            <img :src="currentLanguage.flagCircular??''" alt="Current Language Icon"
                 class="current-language-icon">
            <span class="icon-wrapper language-menu-arrow">
            <inline-svg :src="isDroppedDown?icons.arrowUp:icons.arrowDown"/>
          </span>
          </template>
          <template v-slot:menu>
            <ol class="language-grid dropdown-list">
              <li v-for="language in otherLanguages">
                <router-link :to="{params:{learningLanguage:language.code}}">
                  <img class="image-icon language-icon" :src="language.flagCircular!"
                       :alt="`${language.code} language flag`">
                  <span>{{ language.name }}</span>
                </router-link>
              </li>
              <li class="language-add-button">
                <router-link :to="{ name: 'new-language' }">
                  <inline-svg :src="icons.plusRound"/>
                </router-link>
              </li>
            </ol>
          </template>
        </BaseDropDown>
        <BaseDropDown v-if="userLanguages && userLanguages.length > 0" :is-pointy="true" id="add-menu">
          <template v-slot:button>
            <span class="add-button icon-wrapper">
              <inline-svg :src="icons.plus"/>
            </span>
          </template>
          <template v-slot:menu>
            <ol class="add-menu dropdown-list">
              <li>
                <router-link :to="{name:'add-lesson'}"><span>Add Lesson</span></router-link>
              </li>
              <li>
                <router-link :to="{name:'add-course'}"><span>Add Course</span></router-link>
              </li>
            </ol>
          </template>
        </BaseDropDown>
        <BaseDropDown :is-pointy="true" id="profile-menu">
          <template v-slot:button>
            <BaseImage :image-url="profilePicture"
                       :fall-back-url="icons.userProfile" class="profile-picture"
                       alt="profile picture"/>
          </template>
          <template v-slot:menu>
            <ol class="add-menu dropdown-list">
              <li>
                <router-link :to="{name:'my-profile'}">
                  <inline-svg :src="icons.userProfile"/>
                  <span>My Profile</span>
                </router-link>
              </li>
              <li>
                <router-link :to="{name:'settings'}">
                  <inline-svg :src="icons.settings"/>
                  <span>Settings</span>
                </router-link>
              </li>
              <li>
                <router-link :to="{name:'sign-out'}">
                  <inline-svg :src="icons.signOut"/>
                  <span>Sign Out</span>
                </router-link>
              </li>
            </ol>
          </template>
        </BaseDropDown>
      </div>
      <div v-else>
        <router-link :to="{ name: 'sign-out' }">
          <button class="hollow-button capsule-button link">Sign Out</button>
        </router-link>
      </div>
    </div>
    <NavDropDown :isExpanded="isNavBarExpanded"/>
  </header>
</template>
<script lang="ts">
import BaseDropDown from "@/components/ui/BaseDropDown.vue";
import logo from "@/assets/images/logo.png";
import {icons} from "@/icons.js";
import {useStore} from "@/stores/backend/rootStore.js";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import {defineComponent} from "vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import BaseImage from "@/components/ui/BaseImage.vue";
import InlineSvg from "vue-inline-svg";
import NavBar from "@/components/layout/header/NavBar.vue";
import NavDropDown from "@/components/layout/header/NavDropDown.vue";

export default defineComponent({
  name: "AuthHeader",
  components: {NavDropDown, NavBar, BaseImage, BaseDropDown, InlineSvg},
  data() {
    return {isNavBarExpanded: false};
  },
  computed: {
    userAccount() {
      return this.userStore.userAccount;
    },
    userLanguages() {
      return this.languageStore.userLanguages;
    },
    currentLanguage() {
      return this.userLanguages ? this.userLanguages[0] : null;
    },
    otherLanguages() {
      return this.userLanguages ? this.userLanguages!.filter(lang => lang.code !== this.currentLanguage!.code) : [];
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
      logo,
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
  column-gap: 3rem;
}

.title {
  display: flex;
  align-items: center;
  column-gap: 1rem;
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
  color: var(--on-primary-color);
  border-color: var(--on-secondary-color);
}

.add-button {
  background-color: var(--secondary-color);
  border: 1px solid var(--on-secondary-color);
  padding: 8px;
  border-radius: 8px;
}

.add-button svg {
  color: var(--on-secondary-color);
}


.language-grid {
  display: grid;
  min-width: 120px;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  background-color: var(--background-color);
  border-radius: 3px;
}

:deep(.language-add-button) {
  grid-column: 1/-1;
}

.current-language-icon {
  width: 50px;
  height: 50px;
  background-color: var(--on-primary-color);
  border-radius: 50%;
  padding: 0.2rem;
}

.language-icon {
  width: 25px;
  height: 25px;
}

.language-menu-arrow {
  background-color: var(--on-primary-color);
  color: dimgray;
  padding: 0.25rem;
  border-start-end-radius: 5px;
  border-end-end-radius: 5px;
  margin-inline-start: -3px;
}

:deep(.dropdown-label) {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.profile-picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--on-primary-color);
}

.profile-picture:deep(svg) {
  width: 24px;
  height: 24px;
  color: var(--primary-color);
}

.profile-menu {
  width: 10vw;
  max-width: 100px;
  min-width: 85px;
}

.add-menu {
  width: 100px;
}

#nav-expand-checkbox, label[for=nav-expand-checkbox] {
  display: none;
}

@media screen and (max-width: 750px) {
  .title-nav-div {
    column-gap: 1rem;
  }

  label[for=nav-expand-checkbox] {
    display: block;
    color: var(--on-primary-color);
  }
}

</style>
