<template>
  <BaseCard title="Settings" class="settings-base-card main-page-base-card">
    <template v-slot:content>
      <div class="content">
        <nav class="nav-panel">
          <ul>
            <li :class="{'current-tab':$route.name=='interface-settings'}">
              <router-link :to="{name:'interface-settings'}">
                Interface
              </router-link>
            </li>
            <li :class="{'current-tab':$route.name=='account-settings'}">
              <router-link :to="{name:'account-settings'}">
                Account
              </router-link>
            </li>
            <li :class="{'current-tab':$route.name=='language-settings'}">
              <router-link :to="{name:'language-settings'}">
                Languages
              </router-link>
            </li>
          </ul>
        </nav>
        <hr class="vertical-divider">
        <router-view class="settings-tab">

        </router-view>
      </div>
    </template>

  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";

export default {
  name: "SettingsPage",
  components: {BaseCard},
};
</script>

<style scoped>
.content {
  display: flex;
  height: 50vh;
}

.nav-panel {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  height: 100%;
  flex: 1;
}

.nav-panel a {
  display: block;
  width: 100%;
  text-decoration: none;
  color: var(--on-background-color);
  padding: 1rem 1rem;
}

.current-tab {
  background-color: var(--tab-highlight-color);
}

.settings-tab {
  flex: 4;
}

.vertical-divider {
  border: none;
  border-left: 3px solid var(--divider-color);
  border-radius: 5px;
  margin: 0 1rem 0 0;
}

@media screen and (max-width: 750px) {
  .content {
    flex-direction: column;
    row-gap: 1rem;
  }

  .vertical-divider {
    display: none;
  }

  .nav-panel {
    height: auto;
    flex: 0;
  }

  .nav-panel > ul {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
  }

  .nav-panel > ul > li {
    font-size: 1.2rem;
  }

  .current-tab {
    border-bottom: 3px solid var(--secondary-color);
    background: none;
  }

  .nav-panel a:hover {
    background-color: unset;
  }
}
</style>
