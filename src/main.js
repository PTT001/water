import { createApp } from 'vue';
import App from './App.vue';
import router from '../src/rotuer/index';
import 'blueimp-canvas-to-blob';
import './style.css';

createApp(App).use(router).mount('#app');
