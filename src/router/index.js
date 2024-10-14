import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import AdminSignIn from '../components/AdminSignIn.vue';
import OtherComponent from '../components/OtherComponent.vue';

const routes = [
  {
    path: '/admin-signin',
    name: 'AdminSignIn',
    component: AdminSignIn,
    beforeEnter: (to, from, next) => {
      const auth = getAuth();
      const user = auth.currentUser; // Verifica se o usuário está autenticado
      if (user) {
        next(); // Usuário autenticado, permite acesso à rota
      } else {
        next('/'); // Redireciona para a página inicial se não autenticado
      }
    },
  },
  {
    path: '/',
    name: 'Home',
    component: OtherComponent,
  },
  // Adicione outras rotas aqui
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
