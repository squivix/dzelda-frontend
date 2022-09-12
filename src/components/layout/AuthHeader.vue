<template>
  <header>
    <div class="title-nav-div">
      <router-link :to="{ name: 'home'}" style="text-decoration: none; color: inherit">
        <h1 class="unselectable">Dzelda</h1>
      </router-link>
      <nav>
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

    <div class="right-side-div">
      <base-drop-down v-if="currentLanguage" class="language-dropdown" label="language">
        <template v-slot:button>
          <!--suppress HtmlUnknownTarget, JSUnresolvedVariable -->
          <img :src="currentLanguage.flagCircularImage" alt="Current Language Icon"
               class="language-icon current-language-icon">
          <span class="language-menu-arrow">
                        <font-awesome-icon icon="chevron-down"></font-awesome-icon>
                    </span>
        </template>
        <template v-slot:menu>
          <div class="dropdown-menu">
            <ul class="language-grid">
              <li v-for="language in otherLanguages" :key="language.code">
                <router-link :to="{ name: 'explore-lang' ,params:{learningLanguage:language.code}}">
                  <!--suppress HtmlUnknownTarget -->
                  <img :src="language.flagCircularImage" alt="Language Icon" class="language-icon">
                  <p>{{ language.name }}</p>
                </router-link>
              </li>
            </ul>
            <div class="language-add-button">
              <router-link :to="{ name: 'new-language' }">
                <font-awesome-icon icon="circle-plus" class="language-icon">
                </font-awesome-icon>
              </router-link>
            </div>
          </div>
        </template>
      </base-drop-down>

      <base-drop-down :is-pointy="true" label="add-menu">
        <template v-slot:button>
                    <span class="add-button">
                        <font-awesome-icon icon="plus"></font-awesome-icon>
                    </span>
        </template>
        <template v-slot:menu>
          <ul class="dropdown-menu add-menu">
            <li>
              <router-link :to="{ name: 'add-lesson' }">
                Add Lesson
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'add-course' }">
                Add Course
              </router-link>
            </li>
          </ul>
        </template>
      </base-drop-down>

      <base-drop-down :is-pointy="true" label="profile-menu">
        <template v-slot:button>
          <img v-if="userProfile&&profilePicture" :src="profilePicture" alt="profile picture"
               class="profile-picture">
          <font-awesome-icon v-else icon="user" class="profile-picture"></font-awesome-icon>
        </template>
        <template v-slot:menu>
          <ul class="dropdown-menu profile-menu">
            <li>
              <router-link :to="{ name: 'my-profile' }">
                <font-awesome-icon icon="user"></font-awesome-icon>
                My Profile
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'settings' }">
                <font-awesome-icon icon="gear"></font-awesome-icon>
                Settings
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'sign-out' }">
                <font-awesome-icon icon="arrow-right-from-bracket"></font-awesome-icon>
                Sign Out
              </router-link>
            </li>

          </ul>
        </template>
      </base-drop-down>
    </div>
  </header>
</template>
<script>
import BaseDropDown from "@/components/ui/BaseDropDown.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useStore} from "@/stores/index.js";
import {useLanguageStore} from "@/stores/language.js";
import {useProfileStore} from "@/stores/profile.js";

export default {
  name: "AuthHeader",
  components: {BaseDropDown, FontAwesomeIcon},
  data() {
    return {
      userProfile: null,
      userLanguages: null,
    };
  },
  computed: {
    profilePicture() {
      if (this.userProfile.profilePicture !== null)
        return `${this.store.baseUrl}${this.userProfile.profilePicture}`;
      else
        return null;
    },
    currentLanguage() {
      return this.userLanguages ? this.userLanguages[0] : null;
    },
    otherLanguages() {
      return this.userLanguages.filter(lang => lang.code !== this.currentLanguage.code)
    },
  },
  methods: {
    async fetchUserProfile() {
      return await this.profileStore.fetchUserProfile();
    },
    async fetchUserLanguages() {
      return await this.languageStore.fetchUserLanguages();
    }
  },
  async mounted() {
    this.userProfile = await this.fetchUserProfile();
    this.userLanguages = await this.fetchUserLanguages();
  },
  async created() {
    this.store = useStore();
    this.languageStore = useLanguageStore();
    this.profileStore = useProfileStore();
  }
}
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

nav > ul > li {

}

nav > ul > li:hover {
  color: var(--primary-color-light);
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
  height: 30px;
  width: 30px;
  padding: 5px;
  border: 1px solid var(--on-secondary-color);
  border-radius: 8px;
}

.add-button svg {
  color: var(--on-secondary-color);
  font-size: 1rem;
}

.dropdown-menu li {
  padding: 0;
}

.dropdown-menu li a, .language-add-button a {
  margin: 0;
  display: block;
  width: 100%;
  height: 100%;
  color: black;
  font-family: sans-serif;
  font-size: 0.9rem;
  padding: 0.5rem 0;
}

.dropdown-menu li:hover, .language-add-button a:hover {
  cursor: pointer;
  background-color: lightgray;
}

.dropdown-menu a:hover {
  text-decoration: none;
}

.add-menu {
  width: 125px;
}

.language-grid {
  display: grid;
  width: 25vw;
  max-width: 250px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}

.language-grid li a {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  column-gap: 0.5rem;
  text-align: center;
}

.language-icon {
  width: 25px;
  height: 25px;
}

.language-add-button {
  grid-row: last;
  grid-column: 1/last;

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
  padding: 0.2rem;
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

svg.profile-picture {
  width: 20px;
  height: 20px;
  padding: 0.5rem;
  color: var(--primary-color);
}

.profile-menu {
  width: 10vw;
  max-width: 120px;
}

.profile-menu li a {
  display: flex;
  flex-direction: row;
  justify-content: center;
  column-gap: 0.5rem;
  align-items: center;
  padding: 1rem 0.5rem;
}

</style>