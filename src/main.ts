import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// SCSS file import
import './assets/reset.scss';
import './assets/general.scss';

const app = createApp(App);
app.use(router);
app.mount('#app');