import {createApp} from 'vue'
import App from './App.vue'
import router from './router';
import store from './stores/index.js'

import BaseCard from '@/components/general/ui/BaseCard.vue'
import BasePasswordInput from '@/components/general/ui/BasePasswordInput.vue'

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

import './fa-lib.js';
import {createPinia} from "pinia";

const app = createApp(App)

//router
app.use(router);

//stores
const pinia = createPinia()
app.use(pinia)

//global components
app.component("font-awesome-icon", FontAwesomeIcon)
app.component("base-card", BaseCard);
app.component("base-password-input", BasePasswordInput)


app.mount('#app');