import {createApp, markRaw} from "vue";
import App from "@/App.vue";
import {router} from "@/router/router.js";

import BaseCard from "@/components/ui/BaseCard.vue";
import BasePasswordInput from "@/components/ui/BasePasswordInput.vue";

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

import "@/fa-lib.js";
import {createPinia} from "pinia";
import QuerySynchronizer from "@oarepo/vue-query-synchronizer";

const app = createApp(App);

//router
app.use(router);

//stores
const pinia = createPinia();
pinia.use(({store}) => {
    store.router = markRaw(router)
})
app.use(pinia);

//other libraries
app.use(QuerySynchronizer, {
    router,
    debug: false,
    navigationOperation: "push",
//TODO add array of numbers component see library github
});


//global components
app.component("font-awesome-icon", FontAwesomeIcon);
app.component("base-card", BaseCard);
app.component("base-password-input", BasePasswordInput);

app.mount("#app");