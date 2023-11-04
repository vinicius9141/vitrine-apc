<template>
  <nav class="navbar">
    <router-link to="/">Página Inicial</router-link>
    <router-link v-if="userIsAuthenticated" to="/cadastrar-loja">Cadastrar Loja</router-link>
    <button @click="logout" v-if="userIsAuthenticated">Sair</button>
    <router-link v-else to="/admin-signin">Área adm</router-link>
  </nav>
</template>

<script>
import { ref } from 'vue';
import { signOut } from 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const auth = getAuth();
    const userIsAuthenticated = ref(false);
    const router = useRouter();

    onAuthStateChanged(auth, (user) => {
      userIsAuthenticated.value = !!user;
    });

    const logout = async () => {
      try {
        await signOut(auth);
        router.push('/');
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    };

    return {
      userIsAuthenticated,
      logout,
    };
  },
};
</script>

<style scoped>
.navbar {
  background-color: #333;
  color: #fff;
}

ul {
  list-style: none;
  display: flex;
  justify-content: space-around;
  padding: 0;
}

li {
  margin: 10px;
}

a {
  text-decoration: none;
  color: #fff;
}

button {
  background-color: #d9534f;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #c9302c;
}
</style>
