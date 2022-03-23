<template>
  <h1>Explore!</h1>
</template>

<script>
import store from '../store/index';
export default {
  beforeRouteEnter: async (to) => {
    //if no lang was specified
    if (to.name === 'explore') {
      const response = await fetch(
        `${store.getters.baseUrl}/users/me/languages`,
        {
          method: 'GET',
          headers: {
            Authorization: `Token ${store.getters.user}`,
          },
        }
      );
      const languages = (await response.json()).languages;
      return { path: `/learn/${languages[0].code}/explore` };
    }
  },
};
</script>