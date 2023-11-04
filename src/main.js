import { createApp } from 'vue';
import App from './App.vue';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { createRouter, createWebHistory } from 'vue-router';

import AdminSignIn from './components/AdminSignIn.vue';
import CadastrarLoja from './components/StoreForm.vue';
import StoreList from './components/StoreList.vue';
import MainLayout from './layouts/MainLayout.vue';
import AppNavbar from './components/AppNavbar.vue';

// Importe o Vuex (VueX) para gerenciar o estado global, se você estiver usando Vuex
import store from './store'; // Importe o seu arquivo Vuex aqui

/* eslint-disable */
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAk8cwQapq-DowbO7fLQxK8y4XMp0AN3oY",
  authDomain: "vitrine-apcdb.firebaseapp.com",
  projectId: "vitrine-apcdb",
  storageBucket: "vitrine-apcdb.appspot.com",
  messagingSenderId: "779876038538",
  appId: "1:779876038538:web:a59be6d468714968097a73",
  measurementId: "G-6S6P279BPN"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig); // Use um nome diferente de "app" para evitar conflito

const db = getFirestore(firebaseApp);

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: StoreList },
      { path: 'admin-signin', component: AdminSignIn },
      { path: 'cadastrar-loja', component: CadastrarLoja, meta: { requiresAuth: true } },
      // Outras rotas...
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const appInstance = createApp(App);

// Use o Vuex (VueX) para gerenciar o estado global, se você estiver usando Vuex
appInstance.use(store);

appInstance.use(router);
appInstance.component('MainLayout', MainLayout);
appInstance.component('AppNavbar', AppNavbar);
appInstance.mount('#app');
