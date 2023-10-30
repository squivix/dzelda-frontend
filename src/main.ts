import {createApp, markRaw} from "vue";
import App from "@/App.vue";
import {router} from "@/router/router.js";
import BaseCard from "@/components/ui/BaseCard.vue";
import BasePasswordInput from "@/components/ui/BasePasswordInput.vue";
import {createPinia} from "pinia";
import {Chart as ChartJs, registerables as chartJsRegisterables} from 'chart.js';

const app = createApp(App);

//router
app.use(router);

//stores
const pinia = createPinia();
pinia.use(({store}) => {
    store.router = markRaw(router);
});
app.use(pinia);

//other libraries
ChartJs.register(...chartJsRegisterables);

//global components
app.component("base-card", BaseCard);
app.component("base-password-input", BasePasswordInput);


app.mount("#app");
