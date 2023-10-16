<template>
  <header>
    <div class="title-nav-div">
      <router-link :to="{ name: 'home'}" style="text-decoration: none; color: inherit">
        <h1 class="unselectable">Dzelda</h1>
      </router-link>
      <nav v-if="userAccount?.isEmailConfirmed && userLanguages && userLanguages.length > 0">
        <ul>
          <router-link :to="{ name: 'explore' }" style="text-decoration: none; color: inherit">
            <li>Explore</li>
          </router-link>
          <router-link :to="{ name: 'my-library' }" style="text-decoration: none; color: inherit">
            <li>My Library</li>
          </router-link>
          <router-link :to="{ name: 'my-vocab' }" style="text-decoration: none; color: inherit">
            <li>My Vocab</li>
          </router-link>
        </ul>
      </nav>
    </div>

    <div class="right-side-div" v-if="userAccount?.isEmailConfirmed">
      <base-drop-down v-if="currentLanguage" class="language-dropdown" label="language">
        <template v-slot:button>
          <img :src="currentLanguage.flagCircular??''" alt="Current Language Icon"
               class="language-icon current-language-icon">
          <span class="icon-wrapper language-menu-arrow">
            <inline-svg :src="assets.arrowDown"/>
          </span>
        </template>
        <template v-slot:menu>
          <base-drop-down-list is-grid class="language-grid" :list-items="
            [...otherLanguages.map(language=>({
                  text:language.name,
                  image:{src:language.flagCircular!, alt:'language flag'},
                  link:{ name: 'explore-lang' ,params:{learningLanguage:language.code}}
            })),
            {
                  text:undefined,
                  icon:'circle-plus',
                  link:{ name: 'new-language' },
                  class:'language-add-button'
            }
            ]">

          </base-drop-down-list>
        </template>
      </base-drop-down>
      <base-drop-down v-if="userLanguages && userLanguages.length > 0" :is-pointy="true" label="add-menu">
        <template v-slot:button>
                    <span class="add-button icon-wrapper">
                      <inline-svg :src="assets.plus"/>
                    </span>
        </template>
        <template v-slot:menu>
          <base-drop-down-list class="add-menu"
                               :list-items="[
                        {
                           text:'Add Lesson',
                           link:{ name: 'add-lesson' }
                        },{
                           text:'Add Course',
                           link:{ name: 'add-course' }
                        }
                      ]">
          </base-drop-down-list>


        </template>
      </base-drop-down>
      <base-drop-down :is-pointy="true" label="profile-menu">
        <template v-slot:button>
          <base-image :image-url="userAccount.profile.profilePicture"
                      :fall-back-url="assets.userProfile" class="profile-picture"
                      alt="profile picture"/>
        </template>
        <template v-slot:menu>
          <base-drop-down-list class="profile-menu" :list-items="[
              {
                text:'My Profile',
                link:{ name: 'my-profile' },
                image:{src:assets.userProfile, alt:'my profile icon'}
              },
              {
                text:'Settings',
                link:{ name: 'settings' },
                icon:'gear'
              },
              {
                text:'Sign Out',
                link:{ name: 'sign-out' },
                icon:'arrow-right-from-bracket'
              }
          ]"></base-drop-down-list>
        </template>
      </base-drop-down>
    </div>

    <div v-else>
      <router-link :to="{ name: 'sign-out' }">
        <button class="hollow-button capsule-button link">Sign Out</button>
      </router-link>
    </div>
  </header>
</template>
<script lang="ts">
import BaseDropDown from "@/components/ui/BaseDropDown.vue";
import {useStore} from "@/stores/backend/rootStore.js";
import {useLanguageStore} from "@/stores/backend/languageStore.js";
import BaseDropDownList from "@/components/ui/BaseDropDownList.vue";
import {defineComponent} from "vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import BaseImage from "@/components/ui/BaseImage.vue";
import userProfile from "@/assets/images/user-profile.svg"
import arrowDown from "@/assets/images/arrow-down.svg"
import plus from "@/assets/images/plus.svg"
import InlineSvg from "vue-inline-svg";

export default defineComponent({
  name: "AuthHeader",
  components: {BaseImage, BaseDropDownList, BaseDropDown, InlineSvg},
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
  },
  methods: {},
  async mounted() {
    await this.userStore.fetchUserAccount();
    if (this.userAccount?.profile)
      await this.languageStore.fetchUserLanguages();
  },
  setup() {
    return {
      assets: {userProfile, arrowDown, plus},
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 2vw;
  background-color: var(--primary-color);
  z-index: 5;
}

header h1 {
  color: var(--on-primary-color);
}

header h1:hover {
  text-decoration: none;
}

h1 {
  font: var(--app-title-font);
}

.title-nav-div {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  column-gap: 3rem;
}

nav > ul {
  display: flex;
  flex-direction: row;
  column-gap: 2rem;
  font: 900 1.25rem sans-serif;
  color: var(--on-primary-color);
}

nav > ul > li:hover {
  cursor: pointer;
}

.right-side-div {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  column-gap: min(2vw, 15px);
  margin-right: 1rem;
}

@media screen and (max-width: 400px) {
  .right-side-div {
    display: none;
  }
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
  fill: var(--on-secondary-color);
}


.language-grid {
  display: grid;
  width: 15vw;
  min-width: 120px;
  max-width: 240px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
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

.language-menu-arrow {
  background-color: var(--on-primary-color);
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
  fill: var(--primary-color);
}

.profile-menu {
  width: 10vw;
  max-width: 100px;
  min-width: 85px;
}

.add-menu {
  width: 10vw;
  max-width: 100px;
}

</style>
