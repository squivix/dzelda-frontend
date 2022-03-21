<template>
  <div id="the-root">
    <guest-header></guest-header>
    <aside class="left-side">
      
    </aside>
    <main>
      <router-view></router-view>
    </main>
    <aside class="right-side">
    </aside>
    <the-footer></the-footer>
  </div>
</template>
<script>
import GuestHeader from './components/layout/GuestHeader.vue';
import TheFooter from './components/layout/TheFooter.vue';
export default {
  components: {
    GuestHeader,
    TheFooter,
  },
};
</script>
<style>
@import './assets/styles/reset.css';
@import './assets/styles/common.css';
</style>

<style scoped>
#the-root {
  display: grid;
  grid-template: auto 1fr auto / auto 1fr auto;
  height: 100%;
}
header {
  grid-column: 1 / 4;
  margin-bottom: 3rem;
}
main {
  grid-column: 2 / 3;
}
.left-side {
  grid-column: 1 / 2;
}

main {
  grid-column: 2 / 3;
}

.right-side {
  grid-column: 3 / 4;
}

footer {
  grid-column: 1 / 4;
}
</style>