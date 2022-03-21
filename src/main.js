import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store/index.js'

import BaseCard from '@/components/ui/BaseCard.vue'
import BasePasswordInput from '@/components/ui/BasePasswordInput.vue'

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import './fa-lib.js';
const app = createApp(App)

//router
app.use(router);

//store
app.use(store)

//global components
app.component("font-awesome-icon", FontAwesomeIcon)
app.component("base-card", BaseCard);
app.component("base-password-input", BasePasswordInput)


app.mount('#app');