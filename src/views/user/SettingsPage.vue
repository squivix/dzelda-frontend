<template>
  <base-card title="Settings" class="settings-base-card">
    <template v-slot:content>
      <div class="content">
        <nav class="nav-panel">
          <ul>
            <li>
              <router-link :to="{name:'account-settings'}">
                Account
              </router-link>
            </li>
            <li>
              <router-link :to="{name:'language-settings'}">
                Languages
              </router-link>
            </li>
            <!--                        <li>-->
            <!--                            <router-link :to="{name:'notification-settings'}">-->
            <!--                                Notifications-->
            <!--                            </router-link>-->
            <!--                        </li>-->
          </ul>
        </nav>
        <hr class="vertical-divider">
        <router-view class="settings-tab">

        </router-view>
      </div>
    </template>

  </base-card>
</template>

<script>
import BaseCard from "@/components/ui/BaseCard.vue";

export default {
  name: "SettingsPage",
  components: {BaseCard},
}
</script>

<style scoped>
.settings-base-card {

}

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
  color: black;
  padding: 1rem 1rem;
}

.nav-panel a:hover {
  background-color: lightgray;
}


.settings-tab {
  flex: 4;
}

.vertical-divider {
  border-left: 3px solid silver;
  border-radius: 5px;
  margin: 0 1rem 0 0;
}
</style>